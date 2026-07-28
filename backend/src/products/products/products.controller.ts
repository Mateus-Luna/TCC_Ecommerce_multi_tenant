import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import * as tenantRequestInterface from '../../common/interfaces/tenant-request.interface';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
  ) {}

@Get()
findAll(@Req() req: tenantRequestInterface.TenantRequest) {
  return this.productsService.findAll(req.tenantId);
}

@Get(':id')
findOne(
  @Param('id') id: string,
  @Req() req: tenantRequestInterface.TenantRequest,
) {
  return this.productsService.findOne(
    id,
    req.tenantId,
  );
}

@Post()
@Roles('ADMIN')
create(
  @Body() dto: CreateProductDto,
  @Req() req: tenantRequestInterface.TenantRequest,
) {
  this.assertAdminTenant(req);
  return this.productsService.create(
    req.tenantId,
    dto,
  );
}

@Patch(':id')
@Roles('ADMIN')
update(
  @Param('id') id: string,
  @Body() dto: UpdateProductDto,
  @Req() req: tenantRequestInterface.TenantRequest,
) {
  this.assertAdminTenant(req);
  return this.productsService.update(
    id,
    req.tenantId,
    dto,
  );
}

@Delete(':id')
@Roles('ADMIN')
remove(
  @Param('id') id: string,
  @Req() req: tenantRequestInterface.TenantRequest,
) {
  this.assertAdminTenant(req);
  return this.productsService.remove(
    id,
    req.tenantId,
  );
}

private assertAdminTenant(req: tenantRequestInterface.TenantRequest & { user?: { storeId?: string } }) {
  if (!req.tenantId || req.user?.storeId !== req.tenantId) {
    throw new ForbiddenException('Você não pode gerenciar produtos desta loja.');
  }
}
}
