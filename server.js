const Hapi = require('hapi');
const blockchainController = require('./controllers/blockchain');
async function start() {
  try {
    const server = Hapi.server({
      host: 'localhost',
      port: 8000
    });

    await blockchainController(server);

    await server.start();
    console.log('Server running at:', server.info.uri);
  } catch (err) {
    process.exit(1);
  }
}

start();
