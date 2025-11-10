import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  public readonly client: Redis;
  constructor() {
    this.client = new Redis(process.env.REDIS_URL!);
  }
}
