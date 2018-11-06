const controller = server => {
  server.route({
    method: 'GET',
    path: '/',
    handler: () => {
      const help = `
  <pre>
  Welcome to the Simple Blockchain API

  The following endpoints are available:
  POST /block
    USAGE:
      Add a new block.
    PARAMS:
      body - String
  GET /block/:blockHeight
    USAGE:
      Get the details of a block.
 </pre>
  `;
      return help;
    }
  });
};

module.exports = controller;
