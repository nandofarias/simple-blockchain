const level = require('level');
const chainDB = './chaindata';
const db = level(chainDB);

async function put(key, value) {
  return db.put(key, JSON.stringify(value));
}

async function get(key) {
  const data = await db.get(key);
  try {
    return JSON.parse(data);
  } catch (e) {
    return data;
  }
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
  getAll
};
