import { Reflector } from '@nestjs/core';
import { describe, expect, it, vi } from 'vitest';
import { ROLES_METADATA_KEY } from '../auth/roles.decorator.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { AdController, AdminAdController } from './ad.controller.js';

describe('AdController contract', () => {
  it('exposes public ad reads through the service', async () => {
    const service = {
      listPublic: vi.fn(async () => ({ ads: [] })),
    };
    const controller = new AdController(service as never);

    await expect(controller.list({ placement: 'catalog_hero' })).resolves.toEqual({ ads: [] });
    expect(service.listPublic).toHaveBeenCalledWith({ placement: 'catalog_hero' });
  });
});

describe('AdminAdController RBAC contract', () => {
  it('requires admin role for ad mutations', () => {
    const reflector = new Reflector();

    expect(reflector.get<string[]>(ROLES_METADATA_KEY, AdminAdController)).toEqual(['admin']);
  });

  it('rejects customer users and allows admins at the guard boundary', () => {
    const reflector = {
      getAllAndOverride: vi.fn(() => ['admin']),
    } as unknown as Reflector;
    const guard = new RolesGuard(reflector);
    const contextFor = (role: 'customer' | 'admin') =>
      ({
        getHandler: vi.fn(),
        getClass: vi.fn(),
        switchToHttp: () => ({
          getRequest: () => ({
            headers: {},
            user: { id: 'user-1', email: `${role}@example.com`, role },
          }),
        }),
      }) as never;

    expect(() => guard.canActivate(contextFor('customer'))).toThrow();
    expect(guard.canActivate(contextFor('admin'))).toBe(true);
  });
});
