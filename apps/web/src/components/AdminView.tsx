import { FormEvent } from 'react';
import type { Ad } from '@vps-template/contracts/ads';
import type { Product } from '@vps-template/contracts/products';
import type { AdForm, ProductForm } from '../types';
import { adPlacementLabel, adPlacementOptions, categoryLabel, formatDate, money, productCategoryOptions } from '../utils/formatters';

interface AdminViewProps {
  products: Product[];
  adminForm: ProductForm;
  setAdminForm: (form: ProductForm) => void;
  editingProductId: string | null;
  ads: Ad[];
  adForm: AdForm;
  setAdForm: (form: AdForm) => void;
  editingAdId: string | null;
  onSaveProduct: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  onRetireProduct: (productId: string) => Promise<void>;
  onStartEditing: (product: Product) => void;
  onCancelEditing: () => void;
  onSaveAd: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  onRetireAd: (adId: string) => Promise<void>;
  onStartEditingAd: (ad: Ad) => void;
  onCancelEditingAd: () => void;
  isBusy: boolean;
}

export function AdminView({
  products,
  adminForm,
  setAdminForm,
  editingProductId,
  ads,
  adForm,
  setAdForm,
  editingAdId,
  onSaveProduct,
  onRetireProduct,
  onStartEditing,
  onCancelEditing,
  onSaveAd,
  onRetireAd,
  onStartEditingAd,
  onCancelEditingAd,
  isBusy,
}: AdminViewProps) {
  const isEditing = Boolean(editingProductId);
  const isEditingAd = Boolean(editingAdId);

  return (
    <section className="admin-section view-transition">
      <div className="admin-header">
        <span className="eyebrow">Admin Console</span>
        <h1 className="panel-title">Product Catalog Management</h1>
      </div>

      <div className="admin-grid">
        <form className="admin-form-card" onSubmit={onSaveProduct}>
          <div className="form-card-header">
            <h2>{isEditing ? 'Edit Product' : 'Create New Product'}</h2>
            {isEditing && (
              <button className="ghost-btn cancel-btn" onClick={onCancelEditing} type="button">
                Cancel
              </button>
            )}
          </div>

          <label className="form-field">
            <span>Product Name</span>
            <input
              placeholder="e.g. Minimalist Ceramic Cup"
              value={adminForm.name}
              onChange={(e) => setAdminForm({ ...adminForm, name: e.target.value })}
              required
            />
          </label>

          <label className="form-field">
            <span>Description</span>
            <textarea
              placeholder="Provide product details..."
              rows={3}
              value={adminForm.description}
              onChange={(e) => setAdminForm({ ...adminForm, description: e.target.value })}
              required
            />
          </label>

          <label className="form-field">
            <span>Image URL</span>
            <input
              placeholder="https://images.unsplash.com/..."
              value={adminForm.imageUrl}
              onChange={(e) => setAdminForm({ ...adminForm, imageUrl: e.target.value })}
              required
            />
          </label>

          {adminForm.imageUrl && (
            <div className="image-preview-container">
              <span className="preview-label">Image Preview:</span>
              <img
                src={adminForm.imageUrl}
                alt="Product preview"
                className="image-preview"
                onError={(e) => (e.currentTarget.style.display = 'none')}
                onLoad={(e) => (e.currentTarget.style.display = 'block')}
              />
            </div>
          )}

          <div className="form-two-cols">
            <label className="form-field">
              <span>Category</span>
              <select
                value={adminForm.category}
                onChange={(e) => setAdminForm({ ...adminForm, category: e.target.value as ProductForm['category'] })}
                required
              >
                {productCategoryOptions.map(([category, label]) => (
                  <option key={category} value={category}>
                    {label}
                  </option>
                ))}
              </select>
            </label>

            <label className="form-field">
              <span>Price (in Cents)</span>
              <input
                type="number"
                min={1}
                placeholder="2450 ($24.50)"
                value={adminForm.priceCents}
                onChange={(e) => setAdminForm({ ...adminForm, priceCents: e.target.value })}
                required
              />
            </label>

            <label className="form-field">
              <span>Initial Stock</span>
              <input
                type="number"
                min={0}
                placeholder="15"
                value={adminForm.stock}
                onChange={(e) => setAdminForm({ ...adminForm, stock: e.target.value })}
                required
              />
            </label>
          </div>

          <button className="primary-btn form-submit-btn" disabled={isBusy} type="submit">
            {isBusy ? <span className="btn-spinner"></span> : isEditing ? 'Save Product Changes' : 'Create Product'}
          </button>
        </form>

        <div className="admin-table-card">
          <h2>Active Products ({products.length})</h2>

          <div className="admin-products-list">
            {products.length === 0 ? (
              <p className="empty-table-text">No products created yet.</p>
            ) : (
              products.map((product) => (
                <article className="admin-product-row" key={product.id}>
                  <img className="admin-product-thumb" alt={product.name} src={product.imageUrl} />

                  <div className="admin-product-info">
                    <strong>{product.name}</strong>
                    <span className="admin-product-category">{categoryLabel(product.category)}</span>
                    <span className="admin-product-price">{money(product.priceCents)}</span>
                  </div>

                  <span
                    className={`stock-badge ${product.stock <= 0 ? 'badge-danger' : product.stock < 6 ? 'badge-warning' : 'badge-success'}`}
                  >
                    {product.stock} in stock
                  </span>

                  <div className="admin-row-actions">
                    <button className="ghost-btn edit-action" onClick={() => onStartEditing(product)} type="button">
                      Edit
                    </button>
                    <button
                      className="ghost-btn retire-action"
                      disabled={isBusy}
                      onClick={() => void onRetireProduct(product.id)}
                      type="button"
                    >
                      Retire
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="admin-header ads-admin-header">
        <span className="eyebrow">Merchandising</span>
        <h2 className="panel-title">Ad Placement Management</h2>
      </div>

      <div className="admin-grid ads-admin-grid">
        <form className="admin-form-card" onSubmit={onSaveAd}>
          <div className="form-card-header">
            <h2>{isEditingAd ? 'Edit Ad' : 'Create New Ad'}</h2>
            {isEditingAd && (
              <button className="ghost-btn cancel-btn" onClick={onCancelEditingAd} type="button">
                Cancel
              </button>
            )}
          </div>

          <label className="form-field">
            <span>Title</span>
            <input
              placeholder="e.g. Workspace essentials"
              value={adForm.title}
              onChange={(event) => setAdForm({ ...adForm, title: event.target.value })}
              required
            />
          </label>

          <label className="form-field">
            <span>Image URL</span>
            <input
              placeholder="https://images.unsplash.com/..."
              value={adForm.imageUrl}
              onChange={(event) => setAdForm({ ...adForm, imageUrl: event.target.value })}
              required
            />
          </label>

          <div className="form-two-cols">
            <label className="form-field">
              <span>Placement</span>
              <select
                value={adForm.placement}
                onChange={(event) => setAdForm({ ...adForm, placement: event.target.value as AdForm['placement'] })}
                required
              >
                {adPlacementOptions.map(([placement, label]) => (
                  <option key={placement} value={placement}>
                    {label}
                  </option>
                ))}
              </select>
            </label>

            <label className="form-field">
              <span>Priority</span>
              <input
                min={0}
                max={1000}
                type="number"
                value={adForm.priority}
                onChange={(event) => setAdForm({ ...adForm, priority: event.target.value })}
                required
              />
            </label>
          </div>

          <div className="form-two-cols">
            <label className="form-field">
              <span>Target Type</span>
              <select
                value={adForm.targetMode}
                onChange={(event) => setAdForm({ ...adForm, targetMode: event.target.value as AdForm['targetMode'] })}
              >
                <option value="product">Product</option>
                <option value="url">URL</option>
              </select>
            </label>

            {adForm.targetMode === 'product' ? (
              <label className="form-field">
                <span>Product Target</span>
                <select value={adForm.productId} onChange={(event) => setAdForm({ ...adForm, productId: event.target.value })} required>
                  <option value="">Select product</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </label>
            ) : (
              <label className="form-field">
                <span>Target URL</span>
                <input
                  placeholder="https://example.com/campaign"
                  value={adForm.targetUrl}
                  onChange={(event) => setAdForm({ ...adForm, targetUrl: event.target.value })}
                  required
                />
              </label>
            )}
          </div>

          <div className="form-two-cols">
            <label className="form-field">
              <span>Starts At</span>
              <input type="datetime-local" value={adForm.startsAt} onChange={(event) => setAdForm({ ...adForm, startsAt: event.target.value })} />
            </label>
            <label className="form-field">
              <span>Ends At</span>
              <input type="datetime-local" value={adForm.endsAt} onChange={(event) => setAdForm({ ...adForm, endsAt: event.target.value })} />
            </label>
          </div>

          <label className="stock-filter-toggle ad-active-toggle">
            <input
              type="checkbox"
              checked={adForm.isActive}
              onChange={(event) => setAdForm({ ...adForm, isActive: event.target.checked })}
            />
            <span>Active</span>
          </label>

          <button className="primary-btn form-submit-btn" disabled={isBusy} type="submit">
            {isBusy ? <span className="btn-spinner"></span> : isEditingAd ? 'Save Ad Changes' : 'Create Ad'}
          </button>
        </form>

        <div className="admin-table-card">
          <h2>Ads ({ads.length})</h2>

          <div className="admin-products-list">
            {ads.length === 0 ? (
              <p className="empty-table-text">No ads created yet.</p>
            ) : (
              ads.map((ad) => (
                <article className="admin-product-row admin-ad-row" key={ad.id}>
                  <img className="admin-product-thumb" alt={ad.title} src={ad.imageUrl} />

                  <div className="admin-product-info">
                    <strong>{ad.title}</strong>
                    <span className="admin-product-category">{adPlacementLabel(ad.placement)}</span>
                    <span className="admin-product-price">
                      Priority {ad.priority} · {ad.startsAt ? formatDate(ad.startsAt) : 'Always on'}
                    </span>
                  </div>

                  <span className={`stock-badge ${ad.isActive && !ad.retiredAt ? 'badge-success' : 'badge-danger'}`}>
                    {ad.isActive && !ad.retiredAt ? 'Active' : 'Retired'}
                  </span>

                  <div className="admin-row-actions">
                    <button className="ghost-btn edit-action" onClick={() => onStartEditingAd(ad)} type="button">
                      Edit
                    </button>
                    <button
                      className="ghost-btn retire-action"
                      disabled={isBusy || Boolean(ad.retiredAt)}
                      onClick={() => void onRetireAd(ad.id)}
                      type="button"
                    >
                      Retire
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
