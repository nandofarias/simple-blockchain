const Blockchain = require('../models/Blockchain');
const Block = require('../models/Block');
const Joi = require('joi');
const controller = async server => {
  const blockchain = new Blockchain();
  await blockchain.generateGenesisBlock();

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

  server.route({
    method: 'GET',
    path: '/block/{blockHeight}',
    handler: async (request, h) => {
      const { blockHeight } = request.params;
      const block = await blockchain.getBlock(blockHeight);
      if (!block)
        return h
          .response({
            statusCode: 404,
            error: 'Not Found',
            message: 'Block was not found'
          })
          .code(404);
      return block;
    },
    options: {
      validate: {
        params: {
          blockHeight: Joi.number()
            .integer()
            .min(0)
        }
      }
    }
  });

  server.route({
    method: 'POST',
    path: '/block',
    handler: async (request, h) => {
      const { body } = request.payload;
      const block = await blockchain.addBlock(new Block(body));
      return h.response(block).code(201);
    },
    options: {
      validate: {
        payload: {
          body: Joi.string().required()
        }
      }
    }
  });
};

module.exports = controller;
