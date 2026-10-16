import { z } from 'zod';

export const adPlacementSchema = z.enum(['catalog_hero', 'product_detail', 'cart_summary', 'checkout_summary', 'orders_summary']);

const nullableDateStringSchema = z.string().datetime().nullable();
const adTargetInputSchema = z.object({
  productId: z.string().uuid().optional().nullable(),
  targetUrl: z.string().trim().url().max(2048).optional().nullable(),
});

export const adTargetSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('product'), productId: z.string().uuid(), href: z.string() }),
  z.object({ type: z.literal('url'), targetUrl: z.string().url(), href: z.string().url() }),
]);

export const adSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  imageUrl: z.string().url(),
  placement: adPlacementSchema,
  target: adTargetSchema,
  priority: z.number().int(),
  isActive: z.boolean(),
  startsAt: nullableDateStringSchema,
  endsAt: nullableDateStringSchema,
  retiredAt: nullableDateStringSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

const adInputBaseSchema = z.object({
  title: z.string().trim().min(1).max(120),
  imageUrl: z.string().trim().url().max(2048),
  placement: adPlacementSchema,
  priority: z.number().int().min(0).max(1000).default(0).optional(),
  isActive: z.boolean().default(true).optional(),
  startsAt: z.coerce.date().optional().nullable(),
  endsAt: z.coerce.date().optional().nullable(),
});

export const createAdSchema = adInputBaseSchema
  .merge(adTargetInputSchema)
  .refine((value) => Boolean(value.productId) !== Boolean(value.targetUrl), {
    message: 'Provide exactly one ad target',
    path: ['target'],
  })
  .refine((value) => !value.startsAt || !value.endsAt || value.startsAt <= value.endsAt, {
    message: 'startsAt must be before endsAt',
    path: ['startsAt'],
  });

export const updateAdSchema = adInputBaseSchema
  .partial()
  .merge(adTargetInputSchema.partial())
  .refine((value) => Object.keys(value).length > 0, {
    message: 'At least one ad field is required',
  })
  .refine((value) => !(value.productId && value.targetUrl), {
    message: 'Provide only one ad target',
    path: ['target'],
  })
  .refine((value) => !value.startsAt || !value.endsAt || value.startsAt <= value.endsAt, {
    message: 'startsAt must be before endsAt',
    path: ['startsAt'],
  });

export const adListQuerySchema = z.object({
  placement: adPlacementSchema,
});

export const adListResponseSchema = z.object({
  ads: z.array(adSchema),
});

export const adMutationResponseSchema = z.object({
  ad: adSchema,
});

export type AdPlacement = z.infer<typeof adPlacementSchema>;
export type AdTarget = z.infer<typeof adTargetSchema>;
export type Ad = z.infer<typeof adSchema>;
export type CreateAdInput = z.infer<typeof createAdSchema>;
export type UpdateAdInput = z.infer<typeof updateAdSchema>;
export type AdListResponse = z.infer<typeof adListResponseSchema>;
export type AdMutationResponse = z.infer<typeof adMutationResponseSchema>;
