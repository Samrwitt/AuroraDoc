import { Controller, Get, Query, Res, Req, Post, Body } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import fetch from 'node-fetch';

@Controller('auth')
export class AuthController {
  constructor(
    private auth: AuthService,
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  // ---- GOOGLE ----
  @Get('google/start')
  async googleStart(@Res() res: Response) {
    const state = randomId();
    const params = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
      response_type: 'code',
      scope: process.env.GOOGLE_SCOPES!,
      access_type: 'offline',
      prompt: 'consent',
      state,
    });
    await this.redis.client.setex(`oauth:google:state:${state}`, 600, '1');
    res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
  }

  @Get('google/callback')
  async googleCallback(@Query('code') code: string, @Query('state') state: string, @Res() res: Response) {
    const ok = await this.redis.client.get(`oauth:google:state:${state}`);
    if (!ok) return res.status(400).send('Invalid state');

    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type':'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
        grant_type: 'authorization_code',
      }),
    }).then(r => r.json() as any);

    const idRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenRes.access_token}` },
    }).then(r => r.json() as any);

    const user = await this.auth.upsertUserByProvider('google', {
      id: idRes.id,
      email: idRes.email,
      name: idRes.name,
      avatarUrl: idRes.picture,
    }, {
      access: tokenRes.access_token,
      refresh: tokenRes.refresh_token,
      scope: tokenRes.scope,
      expiresAt: tokenRes.expires_in ? Math.floor(Date.now()/1000) + tokenRes.expires_in : undefined,
    });

    const { accessToken, refreshToken, refreshHash } = await this.auth.issueTokens(user.id, user.email);
    await this.prisma.audit.create({ data: { userId: user.id, action: 'SIGN_IN' } });
    // store refresh hash (simplified: tie to a session record or user table as needed)
    await this.prisma.session.create({ data: { userId: user.id } });

    res.cookie('aurora_access', accessToken, { httpOnly: true, sameSite: 'lax' });
    res.cookie('aurora_refresh', refreshToken, { httpOnly: true, sameSite: 'lax' });
    return res.redirect('/'); // your frontend
  }

  // ---- GITHUB ----
  @Get('github/start')
  async githubStart(@Res() res: Response) {
    const state = randomId();
    await this.redis.client.setex(`oauth:github:state:${state}`, 600, '1');
    const params = new URLSearchParams({
      client_id: process.env.GITHUB_CLIENT_ID!,
      redirect_uri: process.env.GITHUB_REDIRECT_URI!,
      scope: process.env.GITHUB_SCOPES!,
      state,
      allow_signup: 'true',
    });
    res.redirect(`https://github.com/login/oauth/authorize?${params.toString()}`);
  }

  @Get('github/callback')
  async githubCallback(@Query('code') code: string, @Query('state') state: string, @Res() res: Response) {
    const ok = await this.redis.client.get(`oauth:github:state:${state}`);
    if (!ok) return res.status(400).send('Invalid state');

    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type':'application/json', 'Accept':'application/json' },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID!,
        client_secret: process.env.GITHUB_CLIENT_SECRET!,
        code,
        redirect_uri: process.env.GITHUB_REDIRECT_URI!,
      }),
    }).then(r => r.json() as any);

    const userRes = await fetch('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${tokenRes.access_token}`, 'User-Agent':'AuroraAuth' },
    }).then(r => r.json() as any);

    // primary email (fallback)
    let email = userRes.email;
    if (!email) {
      const emails = await fetch('https://api.github.com/user/emails', {
        headers: { Authorization: `Bearer ${tokenRes.access_token}`, 'User-Agent':'AuroraAuth' },
      }).then(r => r.json() as any[]);
      email = (emails.find(e => e.primary)?.email) || emails[0]?.email;
    }

    const user = await this.auth.upsertUserByProvider('github', {
      id: String(userRes.id),
      email,
      name: userRes.name,
      avatarUrl: userRes.avatar_url,
    }, {
      access: tokenRes.access_token,
      scope: tokenRes.scope,
    });

    const { accessToken, refreshToken } = await this.auth.issueTokens(user.id, user.email);
    await this.prisma.audit.create({ data: { userId: user.id, action: 'LINK_GITHUB' } });

    res.cookie('aurora_access', accessToken, { httpOnly: true, sameSite: 'lax' });
    res.cookie('aurora_refresh', refreshToken, { httpOnly: true, sameSite: 'lax' });
    return res.redirect('/');
  }

  // ---- Refresh (simplified) ----
  @Post('refresh')
  async refresh(@Req() req: Request, @Res() res: Response, @Body() body: any) {
    const rt = (req.cookies?.aurora_refresh as string) || body.refreshToken;
    if (!rt) return res.status(401).send('No refresh token');
    // In a real flow, you'd look up stored hash per session & compare here.
    // For now, re-issue a new AT/RT after a basic check or stub.
    return res.status(501).send('Wire refresh store before enabling');
  }
}

function randomId() {
  return Math.random().toString(36).slice(2);
}
