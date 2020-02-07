const Hapi = require('@hapi/hapi');
const docsController = require('./controllers/docs');
const blockchainController = require('./controllers/blockchain');
const walletController = require('./controllers/wallet');

async function start() {
  try {
    const server = Hapi.server({
      host: 'localhost',
      port: 8000
    });

    docsController(server);
    walletController(server);
    blockchainController(server);

    await server.start();
    console.log('Server running at:', server.info.uri);
  } catch (err) {
    console.error(err)
    process.exit(1);
  }
}

start();
