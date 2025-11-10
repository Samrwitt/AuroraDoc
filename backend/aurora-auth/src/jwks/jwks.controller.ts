import { Controller, Get } from '@nestjs/common';
import { JwksService } from './jwks.service';

@Controller('.well-known')
export class JwksController {
  constructor(private jwks: JwksService) {}
  @Get('jwks.json')
  getJwks() { return this.jwks.getJwks(); }
}
