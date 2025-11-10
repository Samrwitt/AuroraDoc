import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class CryptoService {
  private key = crypto.createHash('sha256').update(process.env.JWT_PRIVATE_KEY_B64 || 'dev').digest(); // demo

  encrypt(plain: string): string {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', this.key, iv);
    const enc = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();
    return Buffer.concat([iv, tag, enc]).toString('base64');
  }

  decrypt(payloadB64: string): string {
    const buf = Buffer.from(payloadB64, 'base64');
    const iv = buf.slice(0, 12);
    const tag = buf.slice(12, 28);
    const data = buf.slice(28);
    const decipher = crypto.createDecipheriv('aes-256-gcm', this.key, iv);
    decipher.setAuthTag(tag);
    const dec = Buffer.concat([decipher.update(data), decipher.final()]);
    return dec.toString('utf8');
  }
}
