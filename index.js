const {
  createHash,
  randomBytes,
  scryptSync,
  createCipher,
  scrypt,
  createCipheriv,
} = require('crypto');
const { promisify } = require('util');

const messages = ['asd', 'asd'];

async function encrypt(message) {
  const iv = randomBytes(16);
  const password = 'Password used to generate key';

  // The key length is dependent on the algorithm.
  // In this case for aes256, it is 32 bytes.
  const key = await promisify(scrypt)(password, 'salt', 32);
  const cipher = createCipheriv('aes-256-ctr', key, iv);

  return cipher.update(message, 'utf-8', 'hex') + cipher.final('hex');
}

messages.forEach(async (msg) => console.log(await encrypt(msg)));
