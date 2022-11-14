import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EncryptionService {
  private readonly algorithm = 'aes-256-ctr';
  private readonly messageEncoding = 'utf-8';
  private readonly encryptedEncoding = 'base64';

  async encrypt(password: Buffer, message: string) {
    const salt = randomBytes(16);
    const iv = randomBytes(16);

    const key = (await promisify(scrypt)(password, salt, 32)) as Buffer;
    const cipher = createCipheriv(this.algorithm, key, iv);

    const encryptedMessage =
      cipher.update(message, this.messageEncoding, this.encryptedEncoding) +
      cipher.final(this.encryptedEncoding);

    // eslint-disable-next-line prettier/prettier
    // prettier-ignore
    return `${salt.toString(this.encryptedEncoding)}:${iv.toString(this.encryptedEncoding)}:${encryptedMessage}`;
  }

  async decrypt(password: Buffer, message: string) {
    const [salt, iv, encryptedMessage] = message
      .split(':')
      .map((value) => Buffer.from(value, this.encryptedEncoding));

    const key = (await promisify(scrypt)(password, salt, 32)) as Buffer;
    const decipher = createDecipheriv(this.algorithm, key, iv);

    const decryptedMessage =
      decipher.update(encryptedMessage, undefined, this.messageEncoding) +
      decipher.final(this.messageEncoding);

    return decryptedMessage;
  }
}
