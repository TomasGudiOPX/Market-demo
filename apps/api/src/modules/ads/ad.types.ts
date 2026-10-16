import type { Ad, AdPlacement, AdTarget } from '@vps-template/contracts/ads';

export type AdRow = {
  id: string;
  title: string;
  imageUrl: string;
  placement: AdPlacement;
  targetUrl: string | null;
  productId: string | null;
  priority: number;
  isActive: boolean;
  startsAt: Date | null;
  endsAt: Date | null;
  retiredAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

function toTarget(row: AdRow): AdTarget {
  if (row.productId) {
    return { type: 'product', productId: row.productId, href: `/products/${row.productId}` };
  }

  return { type: 'url', targetUrl: row.targetUrl!, href: row.targetUrl! };
}

export function toAd(row: AdRow): Ad {
  return {
    id: row.id,
    title: row.title,
    imageUrl: row.imageUrl,
    placement: row.placement,
    target: toTarget(row),
    priority: row.priority,
    isActive: row.isActive,
    startsAt: row.startsAt?.toISOString() ?? null,
    endsAt: row.endsAt?.toISOString() ?? null,
    retiredAt: row.retiredAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}
