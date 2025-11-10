import { Injectable } from '@nestjs/common';
import { createPrivateKey, createPublicKey } from 'crypto';

@Injectable()
export class JwksService {
  private privateKeyPem: string;
  private publicKeyPem: string;
  private kid = 'dev-1';

  constructor() {
    const privB64 = process.env.JWT_PRIVATE_KEY_B64!;
    const pubB64  = process.env.JWT_PUBLIC_KEY_B64!;
    this.privateKeyPem = Buffer.from(privB64, 'base64').toString('utf8');
    this.publicKeyPem  = Buffer.from(pubB64, 'base64').toString('utf8');
  }

  getPrivateKey() { return createPrivateKey(this.privateKeyPem); }
  getPublicKey() { return createPublicKey(this.publicKeyPem); }
  getKid() { return this.kid; }

  getJwks() {
    // minimal JWKS (PEM->SPKI->JWK would be ideal; for now we expose PEM via x5c-less JWK)
    return {
      keys: [
        {
          kty: 'RSA',
          use: 'sig',
          alg: 'RS256',
          kid: this.kid,
          // For brevity, expose PEM as `x5c`-less JWK-like (downstream Nest can verify via /.well-known/jwks.json using PEM)
          // In production, convert to proper JWK (n,e)
          pem: Buffer.from(this.publicKeyPem).toString('base64'),
        },
      ],
    };
  }
}
