const bitcoinMessage = require('bitcoinjs-message');

class Wallet {
  constructor(address) {
    this.address = address;
  }

  requestValidation() {
    const timestamp = Math.floor(Date.now() / 1000);
    return {
      address: this.address,
      requestTimeStamp: timestamp,
      message: `${this.address}:${timestamp}:starRegistry`,
      validationWindow: 300
    };
  }

  validateMessageSignature(validation, signature) {
    const timestamp = Math.floor(Date.now() / 1000);
    const validationWindow =
      validation.validationWindow - (timestamp - validation.requestTimeStamp);
    let isValid = false;
    try {
      isValid = bitcoinMessage.verify(
        validation.message,
        this.address,
        signature
      );
    } catch (error) {
      console.log(error);
    }
    return {
      registerStar: isValid,
      status: {
        ...validation,
        validationWindow,
        messageSignature: isValid ? 'valid' : 'invalid'
      }
    };
  }
}

module.exports = Wallet;
