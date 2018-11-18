const bitcoinMessage = require('bitcoinjs-message');
const mempool = require('memory-cache');
const mempoolValid = new mempool.Cache();

class Wallet {
  constructor(address) {
    this.address = address;
  }

  getValidation() {
    return mempool.get(this.address);
  }

  hasValidRequest() {
    return mempoolValid.get(this.address);
  }

  deleteValidRequest() {
    return mempoolValid.del(this.address);
  }

  requestValidation() {
    const timestamp = Math.floor(Date.now() / 1000);
    const validation = this.getValidation();
    if (validation) {
      const validationWindow =
        validation.validationWindow - (timestamp - validation.requestTimeStamp);
      return { ...validation, validationWindow };
    } else {
      const validation = {
        address: this.address,
        requestTimeStamp: timestamp,
        message: `${this.address}:${timestamp}:starRegistry`,
        validationWindow: 300
      };
      mempool.put(this.address, validation, validation.validationWindow * 1000);

      return validation;
    }
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
    if (isValid) {
      mempool.del(this.address);
      mempoolValid.put(this.address, true);
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
