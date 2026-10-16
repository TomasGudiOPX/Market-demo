import { describe, expect, it, vi } from 'vitest';
import { AdRepository } from './ad.repository.js';

describe('AdRepository', () => {
  it('filters public placement ads by active state, schedule window, and active linked products', async () => {
    const findMany = vi.fn(async () => []);
    const prisma = {
      ad: { findMany },
    };
    const repository = new AdRepository(prisma as never);
    const now = new Date('2026-08-10T12:00:00.000Z');

    await repository.listEligible('catalog_hero', now);

    expect(findMany).toHaveBeenCalledWith({
      where: {
        placement: 'catalog_hero',
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
  });
});
