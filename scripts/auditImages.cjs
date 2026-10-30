const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const dbPath = path.join(__dirname, '..', 'db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

console.log(`Total movies in db.json: ${db.movies.length}`);

async function checkUrl(url) {
  if (!url || !url.trim()) return { ok: false, status: 'empty' };
  try {
    const parsed = new URL(url);
    const client = parsed.protocol === 'https:' ? https : http;
    return new Promise((resolve) => {
      const req = client.request(
        parsed,
        {
          method: 'HEAD',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
            'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
          },
          timeout: 5000,
        },
        (res) => {
          const contentType = res.headers['content-type'] || '';
          const isImage = contentType.startsWith('image/');
          if (res.statusCode >= 200 && res.statusCode < 400) {
            resolve({ ok: true, status: res.statusCode, contentType, isImage });
          } else {
            resolve({ ok: false, status: res.statusCode, contentType });
          }
        }
      );
      req.on('error', (err) => resolve({ ok: false, status: 'error', error: err.message }));
      req.on('timeout', () => {
        req.destroy();
        resolve({ ok: false, status: 'timeout' });
      });
      req.end();
    });
  } catch (e) {
    return { ok: false, status: 'invalid_url', error: e.message };
  }
}

async function audit() {
  let brokenPosters = 0;
  let workingPosters = 0;
  let brokenBackdrops = 0;
  let workingBackdrops = 0;
  let missingBackdrops = 0;

  const results = [];

  for (const m of db.movies) {
    const posterRes = await checkUrl(m.poster);
    const backdropRes = m.backdrop ? await checkUrl(m.backdrop) : { ok: false, status: 'missing' };

    if (posterRes.ok) workingPosters++;
    else brokenPosters++;

    if (!m.backdrop) missingBackdrops++;
    else if (backdropRes.ok) workingBackdrops++;
    else brokenBackdrops++;

    results.push({
      id: m.id,
      title: m.title,
      year: m.releaseYear,
      language: m.language,
      poster: m.poster,
      posterStatus: posterRes.status,
      posterOk: posterRes.ok,
      backdrop: m.backdrop,
      backdropStatus: backdropRes.status,
      backdropOk: backdropRes.ok
    });
  }

  console.log('\n--- AUDIT SUMMARY ---');
  console.log(`Total Movies: ${db.movies.length}`);
  console.log(`Working Posters: ${workingPosters}`);
  console.log(`Broken / Invalid Posters: ${brokenPosters}`);
  console.log(`Working Backdrops: ${workingBackdrops}`);
  console.log(`Broken Backdrops: ${brokenBackdrops}`);
  console.log(`Missing Backdrops: ${missingBackdrops}`);

  console.log('\n--- SAMPLE BROKEN POSTERS (First 15) ---');
  const broken = results.filter(r => !r.posterOk).slice(0, 15);
  for (const b of broken) {
    console.log(`[${b.id}] "${b.title}" (${b.year}, ${b.language}) -> Status: ${b.posterStatus} | URL: ${b.poster}`);
  }

  console.log('\n--- SAMPLE WORKING POSTERS (First 5) ---');
  const working = results.filter(r => r.posterOk).slice(0, 5);
  for (const w of working) {
    console.log(`[${w.id}] "${w.title}" -> ${w.poster}`);
  }
}

audit();
