import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { AdService } from './ad.service.js';

const adBodySchema = {
  type: 'object',
  required: ['title', 'imageUrl', 'placement'],
  properties: {
    title: { type: 'string', maxLength: 120 },
    imageUrl: { type: 'string', format: 'uri' },
    placement: {
      type: 'string',
      enum: ['catalog_hero', 'product_detail', 'cart_summary', 'checkout_summary', 'orders_summary'],
    },
    productId: { type: 'string', format: 'uuid' },
    targetUrl: { type: 'string', format: 'uri' },
    priority: { type: 'integer', minimum: 0, maximum: 1000 },
    isActive: { type: 'boolean' },
    startsAt: { type: 'string', format: 'date-time', nullable: true },
    endsAt: { type: 'string', format: 'date-time', nullable: true },
  },
};

@ApiTags('ads')
@Controller('api/ads')
export class AdController {
  constructor(private readonly ads: AdService) {}

  @Get()
  @ApiOperation({ summary: 'List active storefront ads for a placement' })
  async list(@Query() query: unknown) {
    return this.ads.listPublic(query);
  }
}

@ApiTags('admin ads')
@ApiBearerAuth()
@Controller('api/admin/ads')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminAdController {
  constructor(private readonly ads: AdService) {}

  @Get()
  @ApiOperation({ summary: 'List ads as an administrator' })
  async listAdmin() {
    return this.ads.listAdmin();
  }

  @Post()
  @ApiOperation({ summary: 'Create an ad as an administrator' })
  @ApiBody({ schema: adBodySchema })
  async create(@Body() body: unknown) {
    return { ad: await this.ads.create(body) };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an ad as an administrator' })
  @ApiBody({ schema: { ...adBodySchema, required: [] } })
  async update(@Param('id') id: string, @Body() body: unknown) {
    return { ad: await this.ads.update(id, body) };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Retire an ad as an administrator' })
  async retire(@Param('id') id: string) {
    return { ad: await this.ads.retire(id) };
  }
}
