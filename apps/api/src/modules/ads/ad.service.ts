import { Injectable } from '@nestjs/common';
import type { Ad, AdPlacement, CreateAdInput, UpdateAdInput } from '@vps-template/contracts/ads';
import { adListQuerySchema, createAdSchema, updateAdSchema } from '@vps-template/contracts/ads';
import { z } from 'zod';
import { AppError } from '../../platform/app-error.js';
import { AdRepository } from './ad.repository.js';
import { toAd } from './ad.types.js';

const adIdSchema = z.string().uuid();

@Injectable()
export class AdService {
  constructor(private readonly repository: AdRepository) {}

  async listPublic(query: unknown = {}): Promise<{ ads: Ad[] }> {
    const { placement } = adListQuerySchema.parse(query);
    const ads = await this.repository.listEligible(placement, new Date());
    return { ads: ads.map(toAd) };
  }

  async listAdmin(): Promise<{ ads: Ad[] }> {
    const ads = await this.repository.listAdmin();
    return { ads: ads.map(toAd) };
  }

  async create(input: unknown): Promise<Ad> {
    const parsed = createAdSchema.parse(input);
    await this.validateProductTarget(parsed);
    return toAd(await this.repository.create(parsed));
  }

  async update(id: string, input: unknown): Promise<Ad> {
    const adId = adIdSchema.parse(id);
    await this.ensureExists(adId);
    const parsed = updateAdSchema.parse(input);
    await this.validateProductTarget(parsed);
    return toAd(await this.repository.update(adId, parsed));
  }

  async retire(id: string): Promise<Ad> {
    const adId = adIdSchema.parse(id);
    await this.ensureExists(adId);
    return toAd(await this.repository.retire(adId));
  }

  private async ensureExists(id: string) {
    const ad = await this.repository.findById(id);

    if (!ad) {
      throw new AppError(404, 'AD_NOT_FOUND', 'Ad not found');
    }
  }

  private async validateProductTarget(input: CreateAdInput | UpdateAdInput) {
    if (!input.productId) {
      return;
    }

    if (!(await this.repository.productIsActive(input.productId))) {
      throw new AppError(400, 'AD_TARGET_INVALID', 'Product-linked ads require an active product', {
        productId: ['Product must exist and be active'],
      });
    }
  }
}
