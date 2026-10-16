---
tags: [evidencia, ads, admin, storefront]
---

# Evidencia - Ads Module

## Alcance

- OpenSpec: `openspec/changes/add-ads-module`.
- Capability: `ads-management`.
- Modulos: contratos compartidos, Prisma, NestJS `ads`, storefront slots, consola admin.

## Decisiones

- Ads queda como modulo separado de productos.
- Los targets validos son exactamente uno de producto activo o URL.
- La elegibilidad publica se filtra por placement, activo, retiro logico, ventana temporal y producto activo.
- Los slots UI colapsan cuando la lectura esta vacia o falla para no bloquear catalogo, detalle, carrito, checkout u ordenes.

## Evidencia de Implementacion

- `packages/contracts/src/ads.ts`: schemas y tipos.
- `apps/api/src/modules/ads/`: controller, service, repository, mapper y tests.
- `apps/web/src/components/AdSlot.tsx`: slots publicos resilientes.
- `apps/web/src/components/AdminView.tsx`: administracion de ads.
- `tests/qa-commerce-smoke.mjs`: checks publicos y RBAC cliente.

## Verificacion Parcial

- `yarn workspace @vps-template/contracts build`: OK.
- `yarn workspace @vps-template/api prisma:generate`: OK.
- `yarn workspace @vps-template/api build`: OK.
- `yarn workspace @vps-template/web lint`: OK.
- `yarn workspace @vps-template/api test -- ad`: OK, 3 archivos, 10 tests.
- `yarn workspace @vps-template/api test`: OK, 14 archivos, 52 tests.
- `yarn workspace @vps-template/web build`: OK.
- `yarn build`: OK.
- `docker compose --env-file .env.example config`: OK.
- `openspec validate add-ads-module --strict`: OK.

## Pendientes

- Crear `apps/api/prisma/migrations/20260810190000_add_ads_module/migration.sql` despues de autorizacion explicita.
- Ejecutar validacion completa y smoke QA con base de datos migrada.
