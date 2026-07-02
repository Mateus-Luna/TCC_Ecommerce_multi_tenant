import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import * as tenantRequestInterface from '../../common/interfaces/tenant-request.interface';

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
create(
  @Body() dto: CreateProductDto,
  @Req() req: tenantRequestInterface.TenantRequest,
) {
  return this.productsService.create(
    req.tenantId,
    dto,
  );
}

@Patch(':id')
update(
  @Param('id') id: string,
  @Body() dto: UpdateProductDto,
  @Req() req: tenantRequestInterface.TenantRequest,
) {
  return this.productsService.update(
    id,
    req.tenantId,
    dto,
  );
}

@Delete(':id')
remove(
  @Param('id') id: string,
  @Req() req: tenantRequestInterface.TenantRequest,
) {
  return this.productsService.remove(
    id,
    req.tenantId,
  );
}
}
