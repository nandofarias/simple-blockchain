const Hapi = require('hapi');
const defaultController = require('./controllers/default');
const blockchainController = require('./controllers/blockchain');
const walletController = require('./controllers/wallet');
async function start() {
  try {
    const server = Hapi.server({
      host: 'localhost',
      port: 8000
    });

    defaultController(server);
    walletController(server);
    await blockchainController(server);

    await server.start();
    console.log('Server running at:', server.info.uri);
  } catch (err) {
    process.exit(1);
  }
}

start();
