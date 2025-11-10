import { Module } from '@nestjs/common';
import { MeController } from './me.controller';
import { JwksModule } from '../jwks/jwks.module';

@Module({
  imports: [JwksModule],
  controllers: [MeController],
})
export class MeModule {}
