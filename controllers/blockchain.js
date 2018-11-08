const Blockchain = require('../models/Blockchain');
const Block = require('../models/Block');
const Joi = require('joi');
const blockchain = new Blockchain();

async function getBlock(request, h) {
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
}

async function saveBlock(request, h) {
  const body = request.payload;
  const block = await blockchain.addBlock(new Block(body));
  return h.response(block).code(201);
}

const controller = server => {
  server.route({
    method: 'GET',
    path: '/block/{blockHeight}',
    handler: getBlock,
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
    handler: saveBlock,
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
