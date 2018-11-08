const Blockchain = require('../models/Blockchain');
const Block = require('../models/Block');
const Joi = require('joi');
const controller = async server => {
  const blockchain = new Blockchain();
  await blockchain.generateGenesisBlock();

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
    method: 'POST',
    path: '/block',
    handler: async (request, h) => {
      const body = request.payload;
      body.star.story = Buffer.from(request.payload.star.story).toString('hex');
      const block = await blockchain.addBlock(new Block(request.payload));
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
