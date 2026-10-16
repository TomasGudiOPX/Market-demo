import { Injectable } from '@nestjs/common';
import type { AdPlacement, CreateAdInput, UpdateAdInput } from '@vps-template/contracts/ads';
import { PrismaService } from '../../platform/prisma.service.js';
import type { AdRow } from './ad.types.js';

@Injectable()
export class AdRepository {
  constructor(private readonly prisma: PrismaService) {}

  async listEligible(placement: AdPlacement, now: Date): Promise<AdRow[]> {
    return this.prisma.ad.findMany({
      where: {
        placement,
        isActive: true,
        retiredAt: null,
        OR: [{ startsAt: null }, { startsAt: { lte: now } }],
        AND: [
          { OR: [{ endsAt: null }, { endsAt: { gte: now } }] },
          { OR: [{ productId: null }, { product: { isActive: true } }] },
        ],
      },
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async listAdmin(): Promise<AdRow[]> {
    return this.prisma.ad.findMany({ orderBy: [{ createdAt: 'desc' }] });
  }

  async findById(id: string): Promise<AdRow | null> {
    return this.prisma.ad.findUnique({ where: { id } });
  }

  async productIsActive(productId: string): Promise<boolean> {
    const product = await this.prisma.product.findFirst({ where: { id: productId, isActive: true }, select: { id: true } });
    return Boolean(product);
  }

  async create(input: CreateAdInput): Promise<AdRow> {
    return this.prisma.ad.create({
      data: {
        title: input.title,
        imageUrl: input.imageUrl,
        placement: input.placement,
        priority: input.priority,
        isActive: input.isActive,
        startsAt: input.startsAt,
        endsAt: input.endsAt,
        productId: input.productId ?? null,
        targetUrl: input.targetUrl ?? null,
      },
    });
  }

  async update(id: string, input: UpdateAdInput): Promise<AdRow> {
    return this.prisma.ad.update({ where: { id }, data: this.writeData(input) });
  }

  async retire(id: string): Promise<AdRow> {
    return this.prisma.ad.update({ where: { id }, data: { isActive: false, retiredAt: new Date() } });
  }

  private writeData(input: UpdateAdInput) {
    const target =
      'productId' in input && input.productId
        ? { productId: input.productId, targetUrl: null }
        : 'targetUrl' in input && input.targetUrl
          ? { targetUrl: input.targetUrl, productId: null }
          : {};

    return {
      ...input,
      ...target,
    };
  }
}
