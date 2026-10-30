const fs = require('fs');
const https = require('https');
const http = require('http');

const db = JSON.parse(fs.readFileSync('db.json', 'utf8'));

function check(url) {
  if (!url) return Promise.resolve(false);
  try {
    const p = new URL(url);
    const client = p.protocol === 'https:' ? https : http;
    return new Promise(resolve => {
      const req = client.request(p, { method: 'HEAD', headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 4000 }, res => {
        resolve(res.statusCode >= 200 && res.statusCode < 400);
      });
      req.on('error', () => resolve(false));
      req.on('timeout', () => { req.destroy(); resolve(false); });
      req.end();
    });
  } catch (e) {
    return Promise.resolve(false);
  }
}

async function run() {
  const brokenPosters = [];
  const brokenBackdrops = [];

  for (const m of db.movies) {
    const pOk = await check(m.poster);
    const bOk = await check(m.backdrop);
    if (!pOk) brokenPosters.push({ id: m.id, title: m.title, year: m.releaseYear, lang: m.language, currentPoster: m.poster });
    if (!bOk) brokenBackdrops.push({ id: m.id, title: m.title, year: m.releaseYear, lang: m.language, currentBackdrop: m.backdrop });
  }

  console.log('BROKEN POSTERS (' + brokenPosters.length + '):');
  brokenPosters.forEach(b => console.log(`[${b.id}] "${b.title}" (${b.year}, ${b.lang})`));

  console.log('\nBROKEN BACKDROPS (' + brokenBackdrops.length + '):');
  brokenBackdrops.forEach(b => console.log(`[${b.id}] "${b.title}" (${b.year}, ${b.lang})`));
}

run();
