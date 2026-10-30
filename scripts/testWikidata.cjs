const https = require('https');

function getTmdbId(title, year) {
  const sparql = `SELECT ?item ?itemLabel ?tmdbId WHERE {
  ?item wdt:P31 wd:Q11424 ;
        wdt:P4947 ?tmdbId .
  ?item rdfs:label ?itemLabel .
  FILTER(LANG(?itemLabel) = "en") .
  FILTER(LCASE(STR(?itemLabel)) = LCASE("${title}"))
} LIMIT 3`;

  const url = 'https://query.wikidata.org/sparql?format=json&query=' + encodeURIComponent(sparql);
  return new Promise(resolve => {
    https.get(url, { headers: { 'User-Agent': 'CineVerse/2.0 (contact@cineverse.local)', 'Accept': 'application/json' } }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try {
          const json = JSON.parse(d);
          const bindings = json.results?.bindings || [];
          resolve(bindings.map(b => b.tmdbId?.value));
        } catch (e) {
          resolve([]);
        }
      });
    }).on('error', () => resolve([]));
  });
}

async function test() {
  const titles = [
    'Baahubali: The Beginning',
    'Baahubali 2: The Conclusion',
    'Kalki 2898 AD',
    'Pushpa: The Rise',
    'The Dark Knight',
    'The Shawshank Redemption',
    'John Wick',
    'Kantara',
    'Vikram'
  ];
  for (const t of titles) {
    const ids = await getTmdbId(t);
    console.log(`${t} -> TMDB IDs:`, ids);
  }
}

test();
