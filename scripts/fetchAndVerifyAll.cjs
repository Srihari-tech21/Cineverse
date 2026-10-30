const fs = require('fs');
const http = require('http');
const https = require('https');

const db = JSON.parse(fs.readFileSync('db.json', 'utf8'));

function queryOmdb(title, year) {
  return new Promise(resolve => {
    // Try with title & year, fallback to title only
    const url = 'http://www.omdbapi.com/?t=' + encodeURIComponent(title) + (year ? '&y=' + year : '') + '&apikey=trilogy';
    http.get(url, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try {
          const j = JSON.parse(d);
          if (j.Response === 'True' && j.Poster && j.Poster !== 'N/A') {
            resolve({ ok: true, poster: j.Poster, imdbID: j.imdbID, title: j.Title, year: j.Year });
          } else {
            // Try title without subtitle or year
            const simpleTitle = title.split(':')[0].split('–')[0].split('-')[0].trim();
            if (simpleTitle !== title) {
              const url2 = 'http://www.omdbapi.com/?t=' + encodeURIComponent(simpleTitle) + '&apikey=trilogy';
              http.get(url2, res2 => {
                let d2 = '';
                res2.on('data', c2 => d2 += c2);
                res2.on('end', () => {
                  try {
                    const j2 = JSON.parse(d2);
                    if (j2.Response === 'True' && j2.Poster && j2.Poster !== 'N/A') {
                      resolve({ ok: true, poster: j2.Poster, imdbID: j2.imdbID, title: j2.Title, year: j2.Year });
                    } else {
                      resolve({ ok: false });
                    }
                  } catch (e) { resolve({ ok: false }); }
                });
              });
            } else {
              resolve({ ok: false });
            }
          }
        } catch (e) { resolve({ ok: false }); }
      });
    }).on('error', () => resolve({ ok: false }));
  });
}

async function testAll() {
  console.log(`Auditing and fetching posters for ${db.movies.length} movies...`);
  const success = [];
  const missing = [];

  for (const m of db.movies) {
    // delay 200ms to be polite
    await new Promise(r => setTimeout(r, 200));
    const res = await queryOmdb(m.title, m.releaseYear);
    if (res.ok) {
      success.push({ id: m.id, title: m.title, year: m.releaseYear, poster: res.poster, imdbID: res.imdbID });
      console.log(`✓ [${m.id}] ${m.title} (${m.releaseYear}) -> ${res.poster.slice(0, 60)}...`);
    } else {
      missing.push({ id: m.id, title: m.title, year: m.releaseYear, lang: m.language });
      console.log(`✗ [${m.id}] ${m.title} (${m.releaseYear}) -> NOT FOUND`);
    }
  }

  console.log('\n--- RESULTS ---');
  console.log(`Found: ${success.length}/${db.movies.length}`);
  console.log(`Missing: ${missing.length}/${db.movies.length}`);
  if (missing.length > 0) {
    console.log('\nMissing titles:');
    missing.forEach(m => console.log(`- [${m.id}] "${m.title}" (${m.year}, ${m.lang})`));
  }
}

testAll();
