import { describe, expect, it, vi } from 'vitest';
import { ZodError } from 'zod';
import { AppError } from '../../platform/app-error.js';
import type { AdRepository } from './ad.repository.js';
import { AdService } from './ad.service.js';
import type { AdRow } from './ad.types.js';

const activeAd: AdRow = {
  id: '10000000-0000-4000-8000-000000000001',
  title: 'Workspace essentials',
  imageUrl: 'https://example.com/ad.jpg',
  placement: 'catalog_hero',
  targetUrl: null,
  productId: '20000000-0000-4000-8000-000000000001',
  priority: 100,
  isActive: true,
  startsAt: null,
  endsAt: null,
  retiredAt: null,
  createdAt: new Date('2026-08-10T10:00:00.000Z'),
  updatedAt: new Date('2026-08-10T10:00:00.000Z'),
};

function createService(activeProducts = new Set([activeAd.productId])) {
  const ads = [activeAd];
  const repository = {
    listEligible: vi.fn(async () => ads),
    listAdmin: vi.fn(async () => ads),
    findById: vi.fn(async (id: string) => ads.find((ad) => ad.id === id) ?? null),
    productIsActive: vi.fn(async (id: string) => activeProducts.has(id)),
    create: vi.fn(async (input) => ({ ...activeAd, ...input })),
    update: vi.fn(async (id, input) => ({ ...activeAd, id, ...input })),
    retire: vi.fn(async (id) => ({ ...activeAd, id, isActive: false, retiredAt: new Date('2026-08-10T11:00:00.000Z') })),
  } satisfies Pick<
    AdRepository,
    'listEligible' | 'listAdmin' | 'findById' | 'productIsActive' | 'create' | 'update' | 'retire'
  >;

  return {
    repository,
    service: new AdService(repository as unknown as AdRepository),
  };
}

describe('AdService', () => {
  it('lists eligible ads by placement and maps product targets', async () => {
    const { repository, service } = createService();

    const result = await service.listPublic({ placement: 'catalog_hero' });

    expect(repository.listEligible).toHaveBeenCalledWith('catalog_hero', expect.any(Date));
    expect(result.ads).toEqual([
      expect.objectContaining({
        id: activeAd.id,
        target: { type: 'product', productId: activeAd.productId, href: `/products/${activeAd.productId}` },
      }),
    ]);
  });

  it('rejects invalid placement queries', async () => {
    const { service } = createService();

    await expect(service.listPublic({ placement: 'invalid' })).rejects.toBeInstanceOf(ZodError);
  });

  it('creates valid product-linked ads for active products', async () => {
    const { repository, service } = createService();

    await service.create({
      title: 'New campaign',
      imageUrl: 'https://example.com/new.jpg',
      placement: 'product_detail',
      productId: activeAd.productId,
      priority: 10,
    });

    expect(repository.productIsActive).toHaveBeenCalledWith(activeAd.productId);
    expect(repository.create).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'New campaign', placement: 'product_detail', productId: activeAd.productId }),
    );
  });

  it('rejects inactive product targets', async () => {
    const { service } = createService(new Set());

    await expect(
      service.create({
        title: 'Inactive target',
        imageUrl: 'https://example.com/new.jpg',
        placement: 'catalog_hero',
        productId: activeAd.productId,
      }),
    ).rejects.toMatchObject({ code: 'AD_TARGET_INVALID' } satisfies Partial<AppError>);
  });

  it('rejects invalid target and schedule input', async () => {
    const { service } = createService();

    await expect(
      service.create({
        title: 'Broken',
        imageUrl: 'https://example.com/new.jpg',
        placement: 'catalog_hero',
        productId: activeAd.productId,
        targetUrl: 'https://example.com',
      }),
    ).rejects.toBeInstanceOf(ZodError);
    await expect(
      service.create({
        title: 'Broken',
        imageUrl: 'https://example.com/new.jpg',
        placement: 'catalog_hero',
        targetUrl: 'https://example.com',
        startsAt: '2026-08-11T00:00:00.000Z',
        endsAt: '2026-08-10T00:00:00.000Z',
      }),
    ).rejects.toBeInstanceOf(ZodError);
  });

  it('updates and retires ads without hard deleting them', async () => {
    const { repository, service } = createService();

    await expect(service.update(activeAd.id, { priority: 1 })).resolves.toMatchObject({ id: activeAd.id, priority: 1 });
    await expect(service.retire(activeAd.id)).resolves.toMatchObject({ id: activeAd.id, isActive: false });
    expect(repository.retire).toHaveBeenCalledWith(activeAd.id);
  });
});
