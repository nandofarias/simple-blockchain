const level = require('level');
const chainDB = './chaindata';
const db = level(chainDB);

async function put(key, value) {
  return db.put(key, JSON.stringify(value));
}

async function get(key) {
  let data;
  try {
    data = await db.get(key);
    return JSON.parse(data);
  } catch (error) {
    if (error.name === 'NotFoundError') return null;
    return data;
  }
}

async function getByHash(hash) {
  return new Promise((resolve, reject) => {
    db.createReadStream()
      .on('data', item => {
        const block = JSON.parse(item.value);
        if (block.hash === hash) resolve(block);
      })
      .on('error', error => reject(error))
      .on('close', () => resolve(null));
  });
}
async function getByAddress(address) {
  return new Promise((resolve, reject) => {
    const data = [];
    db.createReadStream()
      .on('data', item => {
        const block = JSON.parse(item.value);
        if (block.body && block.body.address === address) data.push(block);
      })
      .on('error', error => reject(error))
      .on('close', () => resolve(data));
  });
}

async function getAll() {
  return new Promise((resolve, reject) => {
    const data = [];
    db.createReadStream()
      .on('data', item => data.push(JSON.parse(item.value)))
      .on('error', error => reject(error))
      .on('close', () => resolve(data));
  });
}

module.exports = {
  put,
  get,
  getByHash,
  getByAddress,
  getAll
};
