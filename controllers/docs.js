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
      address - String
      star - Object
        dec - String
        ra - String
        story - String
        mag - Number
        cons - String
  GET /block/[blockHeight]
    USAGE:
      Get the details of a block.
  POST /requestValidation
    USAGE:
      Make a request for wallet address validation
    PARAMS:
      address - String
  POST /message-signature/validate
    USAGE:
      Validate the message signature for a wallet
    PARAMS:
      address - String
      signature - String
  GET /stars/address:[address]
    USAGE:
      Get the stars associated with an adress
  GET /stars/hash:[hash]
    USAGE:
      Get a star by its hash
 </pre>
  `;
      return help;
    }
  });
};

module.exports = controller;
