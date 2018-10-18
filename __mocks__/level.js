let data = {};
const { Readable } = require('stream');

const level = function() {
  return {
    put: (key, value) => {
      data[key] = value;
      return value;
    },
    get: key => data[key],
    createReadStream: jest.fn(() => {
      const keys = Object.keys(data).reverse();
      const readable = new Readable({
        objectMode: true,
        read() {
          const key = keys.pop();
          if (!key) {
            return this.destroy();
          }
          this.push({ key, value: data[key] });
        }
      });
      return readable;
    })
  };
};
level.__clear__ = () => {
  data = [];
};
module.exports = level;
