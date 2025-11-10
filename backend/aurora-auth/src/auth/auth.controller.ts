import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Res, Query, Headers, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import express from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private auth: AuthService,
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  @Get('google/start')
  @ApiOperation({ summary: 'Start Google OAuth (opens Google consent)' })
  @ApiResponse({ status: 302, description: 'Redirect to Google' })
  async googleStart(@Res() res: express.Response) { /* unchanged */ }

  @Get('google/callback')
  @ApiOperation({ summary: 'Google OAuth callback (handles token exchange, sets cookies, redirects)' })
  @ApiResponse({ status: 302, description: 'Redirect to frontend after login' })
  async googleCallback(/* unchanged */) { /* unchanged */ }

  @Get('github/start')
  @ApiOperation({ summary: 'Start GitHub OAuth (opens GitHub consent)' })
  @ApiResponse({ status: 302, description: 'Redirect to GitHub' })
  async githubStart(@Res() res: express.Response) { /* unchanged */ }

  @Get('github/callback')
  @ApiOperation({ summary: 'GitHub OAuth callback (handles token exchange, sets cookies, redirects)' })
  @ApiResponse({ status: 302, description: 'Redirect to frontend after link/login' })
  async githubCallback(/* unchanged */) { /* unchanged */ }

  @Post('refresh')
  @ApiOperation({ summary: 'Exchange refresh token for new access token (stubbed now)' })
  @ApiResponse({ status: 501, description: 'Not implemented yet' })
  async refresh(/* unchanged */) { /* unchanged */ }
}
