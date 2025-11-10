import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CryptoService } from '../crypto/crypto.service';
import { JwksService } from '../jwks/jwks.service';
import { SignJWT, jwtVerify } from 'jose';
import * as bcrypt from 'bcrypt';

type Provider = 'google' | 'github';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private crypto: CryptoService,
    private jwks: JwksService,
  ) {}

  async upsertUserByProvider(p: Provider, profile: { id: string; email: string; name?: string; avatarUrl?: string }, tokens: { access: string; refresh?: string; scope?: string; expiresAt?: number }) {
    const existingIdentity = await this.prisma.identity.findUnique({
      where: { provider_providerUserId: { provider: p, providerUserId: profile.id } },
      include: { user: true },
    });

    const encAccess  = this.crypto.encrypt(tokens.access);
    const encRefresh = tokens.refresh ? this.crypto.encrypt(tokens.refresh) : null;

    if (existingIdentity) {
      const user = await this.prisma.user.update({
        where: { id: existingIdentity.userId },
        data: {
          email: profile.email,
          name: profile.name,
          avatarUrl: profile.avatarUrl,
          identities: {
            update: {
              where: { id: existingIdentity.id },
              data: {
                accessTokenEnc: encAccess,
                refreshTokenEnc: encRefresh,
                scope: tokens.scope ?? undefined,
                expiresAt: tokens.expiresAt ? new Date(tokens.expiresAt * 1000) : undefined,
              },
            },
          },
        },
      });
      return user;
    }

    const user = await this.prisma.user.upsert({
      where: { email: profile.email },
      update: {
        name: profile.name,
        avatarUrl: profile.avatarUrl,
        identities: {
          create: {
            provider: p,
            providerUserId: profile.id,
            accessTokenEnc: encAccess,
            refreshTokenEnc: encRefresh,
            scope: tokens.scope ?? undefined,
            expiresAt: tokens.expiresAt ? new Date(tokens.expiresAt * 1000) : undefined,
          },
        },
      },
      create: {
        email: profile.email,
        name: profile.name,
        avatarUrl: profile.avatarUrl,
        identities: {
          create: {
            provider: p,
            providerUserId: profile.id,
            accessTokenEnc: encAccess,
            refreshTokenEnc: encRefresh,
            scope: tokens.scope ?? undefined,
            expiresAt: tokens.expiresAt ? new Date(tokens.expiresAt * 1000) : undefined,
          },
        },
        roles: { create: { role: 'OWNER' } },
      },
      include: { identities: true },
    });

    return user;
  }

  async issueTokens(userId: string, email: string) {
    const kid = this.jwks.getKid();
    const privateKey = this.jwks.getPrivateKey();
    const now = Math.floor(Date.now() / 1000);
    const accessTTL = Number(process.env.JWT_ACCESS_TTL_SEC || 900);
    const refreshTTL = Number(process.env.JWT_REFRESH_TTL_SEC || 2592000);

    const access = await new SignJWT({ sub: userId, email })
      .setProtectedHeader({ alg: 'RS256', kid })
      .setIssuer(process.env.JWT_ISSUER!)
      .setAudience(process.env.JWT_AUDIENCE!)
      .setIssuedAt(now)
      .setExpirationTime(now + accessTTL)
      .sign(privateKey);

    const refreshPayload = cryptoRandom();
    const refreshHash = await bcrypt.hash(refreshPayload, 10);

    await this.prisma.session.create({ data: { userId } }); // keep minimal for now

    return { accessToken: access, refreshToken: refreshPayload, refreshHash };
  }

  async verifyRefresh(userId: string, provided: string, storedHash: string) {
    const ok = await bcrypt.compare(provided, storedHash);
    if (!ok) throw new UnauthorizedException('Invalid refresh');
  }
}

function cryptoRandom() {
  return [...crypto.getRandomValues(new Uint8Array(32))]
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}
