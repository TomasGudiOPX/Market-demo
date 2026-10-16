import { useEffect, useState } from 'react';
import type { Ad, AdPlacement } from '@vps-template/contracts/ads';
import { request } from '../services/api';

interface AdSlotProps {
  placement: AdPlacement;
  onSelectProduct?: (productId: string) => void;
}

export function AdSlot({ placement, onSelectProduct }: AdSlotProps) {
  const [ads, setAds] = useState<Ad[]>([]);

  useEffect(() => {
    let ignore = false;

    async function loadAds() {
      try {
        const data = await request<{ ads: Ad[] }>(`/ads?placement=${encodeURIComponent(placement)}`);
        if (!ignore) {
          setAds(data.ads);
        }
      } catch {
        if (!ignore) {
          setAds([]);
        }
      }
    }

    void loadAds();

    return () => {
      ignore = true;
    };
  }, [placement]);

  if (ads.length === 0) {
    return null;
  }

  return (
    <aside className={`ad-slot ad-slot-${placement}`} aria-label="Promotions">
      {ads.map((ad) => {
        const target = ad.target;
        const content = (
          <>
            <img src={ad.imageUrl} alt="" loading="lazy" />
            <span>{ad.title}</span>
          </>
        );

        if (target.type === 'product' && onSelectProduct) {
          return (
            <button className="ad-card" key={ad.id} type="button" onClick={() => onSelectProduct(target.productId)}>
              {content}
            </button>
          );
        }

        return (
          <a className="ad-card" key={ad.id} href={target.href}>
            {content}
          </a>
        );
      })}
    </aside>
  );
}
