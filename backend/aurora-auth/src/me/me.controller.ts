import { Controller, Get, Headers } from '@nestjs/common';
import { jwtVerify, createRemoteJWKSet } from 'jose';
import { PrismaService } from '../prisma/prisma.service';

@Controller('me')
export class MeController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async me(@Headers('authorization') auth: string) {
    const token = auth?.split(' ')[1];
    if (!token) return { error: 'No token' };

    // Verify via local JWKS endpoint
    const JWKS = createRemoteJWKSet(new URL(`${process.env.JWT_ISSUER}/.well-known/jwks.json`));
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: process.env.JWT_ISSUER!,
      audience: process.env.JWT_AUDIENCE!,
    });

    const user = await this.prisma.user.findUnique({ where: { id: payload.sub as string }, include: { identities: true, roles: true } });
    return { user };
  }
}
