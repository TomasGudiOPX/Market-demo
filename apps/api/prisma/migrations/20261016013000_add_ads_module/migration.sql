CREATE TYPE "AdPlacement" AS ENUM ('catalog_hero', 'product_detail', 'cart_summary', 'checkout_summary', 'orders_summary');

CREATE TABLE "ads" (
  "id" UUID NOT NULL,
  "title" TEXT NOT NULL,
  "image_url" TEXT NOT NULL,
  "placement" "AdPlacement" NOT NULL,
  "target_url" TEXT,
  "product_id" UUID,
  "priority" INTEGER NOT NULL DEFAULT 0,
  "is_active" BOOLEAN NOT NULL DEFAULT true,
  "starts_at" TIMESTAMP(3),
  "ends_at" TIMESTAMP(3),
  "retired_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "ads_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ads_title_key" ON "ads"("title");
CREATE INDEX "ads_placement_is_active_priority_idx" ON "ads"("placement", "is_active", "priority");
CREATE INDEX "ads_starts_at_idx" ON "ads"("starts_at");
CREATE INDEX "ads_ends_at_idx" ON "ads"("ends_at");
CREATE INDEX "ads_product_id_idx" ON "ads"("product_id");

ALTER TABLE "ads"
  ADD CONSTRAINT "ads_product_id_fkey"
  FOREIGN KEY ("product_id") REFERENCES "products"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;
