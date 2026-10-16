import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { AdController, AdminAdController } from './ad.controller.js';
import { AdRepository } from './ad.repository.js';
import { AdService } from './ad.service.js';

@Module({
  imports: [AuthModule],
  controllers: [AdController, AdminAdController],
  providers: [AdRepository, AdService],
})
export class AdsModule {}
