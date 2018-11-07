const bitcoin = require('bitcoinjs-lib');
const bitcoinMessage = require('bitcoinjs-message');

const keyPair = bitcoin.ECPair.fromWIF(
  'L54FT1Lt6qAAzGCqMLsYSDLaYVYoCPhKm9x4dvjESYFZ6XNHXULa'
);
const address = keyPair.getAddress().toString();
const privateKey = keyPair.d.toBuffer(32);
const message = '1MG4gaCv1eZ5TfsM35MrLdJtUqzRYWghSH:1541556514:starRegistry';

const signature = bitcoinMessage.sign(message, privateKey, keyPair.compressed);
console.log(address);
console.log(signature.toString('base64'));
