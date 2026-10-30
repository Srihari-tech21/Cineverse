const jsonServer = require('json-server');
const path = require('path');

const server = jsonServer.create();
const dbPath = path.join(__dirname, 'db.json');
const router = jsonServer.router(dbPath);
const middlewares = jsonServer.defaults({ cors: true });

const port = process.env.PORT || 3000;

server.use(middlewares);

// Health check endpoint for Render / cloud hosting
server.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'CineVerse API', timestamp: new Date().toISOString() });
});

server.use(router);

server.listen(port, () => {
  console.log(`[CineVerse Server] JSON Server is running on port ${port}`);
});
