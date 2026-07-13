import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(customerId: string, storeId: string, dto: CreateOrderDto) {
    const products = await this.prisma.product.findMany({
      where: {
        id: {
          in: dto.items.map((item) => item.productId),
        },
        tenantId: storeId,
      },
    });

    return this.prisma.order.create({
      data: {
        customerId,
        storeId,
        items: {
          create: dto.items.map((item) => {
            const product = products.find((p) => p.id === item.productId);

            if (!product) {
              throw new Error(`Product not found: ${item.productId}`);
            }

            return {
              product: {
                connect: {
                  id: item.productId,
                },
              },
              quantity: item.quantity,
              price: product.price,
            };
          }),
        },
      },
      include: {
        items: true,
      },
    });
  }

  async findAllByStore(storeId: string) {
    return this.prisma.order.findMany({
      where: {
        storeId,
      },
      include: {
        customer: true,
        items: true,
      },
    });
  }

  async findMyOrders(customerId: string) {
    return this.prisma.order.findMany({
      where: {
        customerId,
      },
      include: {
        items: true,
      },
    });
  }

  async updateStatus(
    orderId: string,
    dto: UpdateOrderStatusDto,
  ) {
    return this.prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        status: dto.status,
      },
    });
  }
}