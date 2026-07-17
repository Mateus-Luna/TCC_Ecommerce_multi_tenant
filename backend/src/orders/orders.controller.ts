import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';

import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import * as tenantRequestInterface from '../common/interfaces/tenant-request.interface';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(
    @Body() dto: CreateOrderDto,
    @Req() req: tenantRequestInterface.TenantRequest,
  ) {
    return this.ordersService.create(
      req.user!.id,
      req.tenantId,
      dto,
    );
  }

  @Get()
  findAll(@Req() req: tenantRequestInterface.TenantRequest) {
    return this.ordersService.findAllByStore(
      req.tenantId,
    );
  }

  @Get('my-orders')
  findMyOrders(@Req() req: tenantRequestInterface.TenantRequest) {
    return this.ordersService.findMyOrders(
      req.user!.id,
    );
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
    @Req() req: tenantRequestInterface.TenantRequest
  ) {
    return this.ordersService.updateStatus(
      id,
       req.user!.storeId,
      dto
    );
  }
}