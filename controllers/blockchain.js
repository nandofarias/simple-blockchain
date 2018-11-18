const Blockchain = require('../models/Blockchain');
const Block = require('../models/Block');
const Joi = require('joi');
const blockchain = new Blockchain();
const Wallet = require('../models/Wallet');

const controller = server => {
  server.route({
    method: 'GET',
    path: '/block/{blockHeight}',
    handler: async (request, h) => {
      const { blockHeight } = request.params;
      const block = await blockchain.getBlock(blockHeight);
      if (!block) {
        return h
          .response({
            statusCode: 404,
            error: 'Not Found',
            message: 'Block was not found'
          })
          .code(404);
      }
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
    method: 'GET',
    path: '/stars/address:{address}',
    handler: async (request, h) => {
      const { address } = request.params;
      const blocks = await blockchain.getBlocksByAddress(address);
      if (!blocks || blocks.length === 0) {
        return h
          .response({
            statusCode: 404,
            error: 'Not Found',
            message: 'Stars were not found'
          })
          .code(404);
      }
      return blocks;
    },
    options: {
      validate: {
        params: {
          address: Joi.string().required()
        }
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/stars/hash:{hash}',
    handler: async (request, h) => {
      const { hash } = request.params;
      const block = await blockchain.getBlockByHash(hash);
      if (!block) {
        return h
          .response({
            statusCode: 404,
            error: 'Not Found',
            message: 'Block was not found'
          })
          .code(404);
      }
      return block;
    },
    options: {
      validate: {
        params: {
          hash: Joi.string().required()
        }
      }
    }
  });

  server.route({
    method: 'POST',
    path: '/block',
    handler: async (request, h) => {
      const body = request.payload;
      const wallet = new Wallet(body.address);
      if (!wallet.hasValidRequest()) {
        return h
          .response({
            statusCode: 404,
            error: 'Not Found',
            message: 'Valid request was not found'
          })
          .code(404);
      }
      const block = await blockchain.addBlock(new Block(body));
      return h.response(block).code(201);
    },
    options: {
      validate: {
        payload: {
          address: Joi.string().required(),
          star: {
            dec: Joi.string().required(),
            ra: Joi.string().required(),
            story: Joi.string()
              .regex(/^[\x00-\x7F]*$/)
              .max(250)
              .required(),
            mag: Joi.number(),
            cons: Joi.string()
          }
        }
      }
    }
  });
};

module.exports = controller;
