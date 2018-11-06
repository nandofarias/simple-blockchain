const Wallet = require('../models/Wallet');
const Joi = require('joi');

const controller = server => {
  server.route({
    method: 'POST',
    path: '/requestValidation',
    handler: request => {
      const { address } = request.payload;
      const wallet = new Wallet(address);
      const confirmation = wallet.requestValidation();
      return confirmation;
    },
    options: {
      validate: {
        payload: {
          address: Joi.string().required()
        }
      }
    }
  });
};

module.exports = controller;
