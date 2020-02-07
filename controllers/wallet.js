const Wallet = require('../models/Wallet');
const Joi = require('@hapi/joi');
const controller = server => {
  server.route({
    method: 'POST',
    path: '/requestValidation',
    handler: request => {
      const { address } = request.payload;
      const wallet = new Wallet(address);
      const validation = wallet.requestValidation();
      return validation;
    },
    options: {
      validate: {
        payload: Joi.object({
          address: Joi.string().required()
        })
      }
    }
  });

  server.route({
    method: 'POST',
    path: '/message-signature/validate',
    handler: (request, h) => {
      const { address, signature } = request.payload;
      const wallet = new Wallet(address);
      const validation = wallet.getValidation();
      if (!validation) {
        return h
          .response({
            statusCode: 404,
            error: 'Request Validation not found',
            message:
              'Please submit a new request validation before validate the message signature'
          })
          .code(404);
      }
      const response = wallet.validateMessageSignature(validation, signature);
      return response;
    },
    options: {
      validate: {
        payload: Joi.object({
          address: Joi.string().required(),
          signature: Joi.string().required()
        })
      }
    }
  });
};

module.exports = controller;
