import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(customerId: string, tenantId: string, dto: CreateOrderDto) {
    const products = await this.prisma.product.findMany({
      where: {
        id: {
          in: dto.items.map((item) => item.productId),
        },
        tenantId: tenantId,
      },
    });

    return this.prisma.order.create({
      data: {
        customerId,
        storeId: tenantId,
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

  async findAllByStore(tenantId: string) {
    return this.prisma.order.findMany({
      where: {
        storeId: tenantId,
      },
      include: {
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async findMyOrders(customerId: string) {
    return this.prisma.order.findMany({
        where: {
          customerId,
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });
  }

  async updateStatus(
    orderId: string,
    tenantId: string,
    dto: UpdateOrderStatusDto,
  ) {
    const order = await this.prisma.order.findFirst({
      where: {
        id: orderId,
        storeId: tenantId,
      },
    });

    if (!order) {
      throw new Error("Order not found");
    }
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