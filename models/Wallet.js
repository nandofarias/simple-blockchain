class Wallet {
  constructor(address) {
    this.address = address;
  }

  requestValidation() {
    const timestamp = Math.floor(Date.now() / 1000);
    return {
      address: this.address,
      requestTimeStamp: timestamp.toString(),
      message: `${this.address}:${timestamp}:starRegistry`,
      validationWindow: 300
    };
  }
}

module.exports = Wallet;
