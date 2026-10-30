const http = require('http');

function getOmdbPoster(title, year) {
  return new Promise(resolve => {
    const url = 'http://www.omdbapi.com/?t=' + encodeURIComponent(title) + (year ? '&y=' + year : '') + '&apikey=trilogy';
    http.get(url, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try {
          const j = JSON.parse(d);
          if (j.Response === 'True' && j.Poster && j.Poster !== 'N/A') {
            resolve(j.Poster);
          } else {
            const simple = title.split(':')[0].split('–')[0].split('-')[0].trim();
            if (simple !== title) {
              http.get('http://www.omdbapi.com/?t=' + encodeURIComponent(simple) + '&apikey=trilogy', res2 => {
                let d2 = '';
                res2.on('data', c2 => d2 += c2);
                res2.on('end', () => {
                  try {
                    const j2 = JSON.parse(d2);
                    resolve(j2.Poster && j2.Poster !== 'N/A' ? j2.Poster : null);
                  } catch (e) { resolve(null); }
                });
              });
            } else {
              resolve(null);
            }
          }
        } catch (e) { resolve(null); }
      });
    }).on('error', () => resolve(null));
  });
}

async function test() {
  const titles = [
    ['Magadheera', 2009],
    ['Eega', 2012],
    ['Jersey', 2019],
    ['Sita Ramam', 2022],
    ['Hi Nanna', 2023],
    ['Hanu-Man', 2024],
    ['Agent Sai Srinivasa Athreya', 2019],
    ['Mathu Vadalara', 2019],
    ['DJ Tillu', 2022],
    ['Saripodhaa Sanivaaram', 2024],
    ['Mayabazar', 1957],
    ['Sankarabharanam', 1980],
    ['Sagara Sangamam', 1983],
    ['Shiva', 1989],
    ['Athadu', 2005],
    ['Pokiri', 2006],
    ['Bommarillu', 2006],
    ['Vikram', 2022],
    ['Kaithi', 2019],
    ['Maharaja', 2024],
    ['Soorarai Pottru', 2020],
    ['3 Idiots', 2009],
    ['12th Fail', 2023],
    ['Andhadhun', 2018],
    ['Zindagi Na Milegi Dobara', 2011],
    ['Manjummel Boys', 2024],
    ['Drishyam', 2013],
    ['Aavesham', 2024],
    ['Kumbalangi Nights', 2019],
    ['Kantara', 2022],
    ['K.G.F: Chapter 1', 2018],
    ['777 Charlie', 2022]
  ];

  for (const [t, y] of titles) {
    const p = await getOmdbPoster(t, y);
    console.log(`"${t}": "${p}",`);
  }
}

test();
