import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwksModule } from '../jwks/jwks.module';
import { CryptoService } from '../crypto/crypto.service';

@Module({
  imports: [JwtModule.register({}), JwksModule],
  controllers: [AuthController],
  providers: [AuthService, CryptoService],
  exports: [AuthService],
})
export class AuthModule {}
