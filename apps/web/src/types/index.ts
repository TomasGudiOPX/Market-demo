import type { AuthUser } from '@vps-template/contracts/auth';
import type { Ad, AdPlacement } from '@vps-template/contracts/ads';
import type { Cart } from '@vps-template/contracts/cart';
import type { Order } from '@vps-template/contracts/orders';
import type { Product, ProductCategory } from '@vps-template/contracts/products';

export type View = 'catalog' | 'detail' | 'cart' | 'checkout' | 'orders';

export type ApiError = {
  code?: string;
  message?: string;
  fieldErrors?: Record<string, string[]>;
};

export type ProductForm = {
  name: string;
  description: string;
  category: ProductCategory;
  priceCents: string;
  imageUrl: string;
  stock: string;
};

export type AdForm = {
  title: string;
  imageUrl: string;
  placement: AdPlacement;
  targetMode: Ad['target']['type'];
  productId: string;
  targetUrl: string;
  priority: string;
  isActive: boolean;
  startsAt: string;
  endsAt: string;
};

export type AuthMode = 'login' | 'register';

export type ToastType = 'info' | 'success' | 'error';

export type ToastMessage = {
  id: string;
  type: ToastType;
  message: string;
};

export type AppState = {
  view: View;
  products: Product[];
  selectedProductId: string | null;
  selectedProduct: Product | null;
  cart: Cart | null;
  cartCount: number;
  orders: Order[];
  user: AuthUser | null;
  token: string;
  authMode: AuthMode;
  email: string;
  password: string;
  adminForm: ProductForm;
  editingProductId: string | null;
  ads: Ad[];
  adForm: AdForm;
  editingAdId: string | null;
  isAuthOpen: boolean;
  isAuthReady: boolean;
  toasts: ToastMessage[];
  isBusy: boolean;
};
