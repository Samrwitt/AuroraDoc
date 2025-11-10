import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Get } from '@nestjs/common';
import { JwksService } from './jwks.service';

@ApiTags('JWKS')
@Controller('.well-known')
export class JwksController {
  constructor(private jwks: JwksService) {}
  @Get('jwks.json')
  @ApiOperation({ summary: 'Public JWKS for verifying AuroraDoc access tokens' })
  @ApiResponse({ status: 200, description: 'JWKS' })
  getJwks() { return this.jwks.getJwks(); }
}
