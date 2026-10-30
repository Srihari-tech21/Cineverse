const https = require('https');

const movies = [
  { id: 6, title: 'The Grand Budapest Hotel', tmdbId: 120467 },
  { id: 7, title: 'Parasite', tmdbId: 496243 },
  { id: 8, title: 'Dune', tmdbId: 438631 },
  { id: 10, title: 'Everything Everywhere All at Once', tmdbId: 580489 },
  { id: 11, title: 'Oppenheimer', tmdbId: 872585 },
  { id: 13, title: 'Whiplash', tmdbId: 244786 },
  { id: 14, title: 'John Wick', tmdbId: 245891 },
  { id: 15, title: 'Get Out', tmdbId: 419430 }
];

async function getBackdrop(m) {
  const url = `https://www.themoviedb.org/movie/${m.tmdbId}/images/backdrops`;
  return new Promise(resolve => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        // Look for og:image with w780 or backdrop
        const matches = [...d.matchAll(/property="og:image"\s+content="([^"]+)"/g)];
        const backdrops = matches.map(x => x[1]).filter(u => u.includes('w780') || u.includes('w1280') || u.includes('original'));
        if (backdrops.length > 0) {
          const bUrl = backdrops[backdrops.length - 1].replace('media.themoviedb.org', 'image.tmdb.org').replace('/w780/', '/w1280/');
          resolve({ ok: true, url: bUrl });
        } else {
          // fallback to any og:image
          if (matches.length > 1) {
            resolve({ ok: true, url: matches[1][1].replace('media.themoviedb.org', 'image.tmdb.org').replace('/w780/', '/w1280/') });
          } else {
            resolve({ ok: false });
          }
        }
      });
    }).on('error', () => resolve({ ok: false }));
  });
}

async function run() {
  for (const m of movies) {
    const res = await getBackdrop(m);
    console.log(m.id, m.title, '->', res.ok ? res.url : 'FAILED');
  }
}

run();
