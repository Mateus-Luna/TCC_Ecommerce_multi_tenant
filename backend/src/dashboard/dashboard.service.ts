import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class DashboardService {

  constructor(
    private prisma: PrismaService,
  ) {}

  async getMetrics(storeId: string) {

    const [

      products,

      customers,

      orders,

      pendingOrders,

      deliveredOrders,

      revenue,

      store,

    ] = await Promise.all([

      this.prisma.product.count({
        where: {
          tenantId: storeId,
        },
      }),

      this.prisma.user.count({
        where: {
          storeId,
          role: "CUSTOMER",
        },
      }),

      this.prisma.order.count({
        where: {
          storeId,
        },
      }),

      this.prisma.order.count({
        where: {
          storeId,
          status: "PENDING",
        },
      }),

      this.prisma.order.count({
        where: {
          storeId,
          status: "DELIVERED",
        },
      }),

      this.prisma.orderItem.aggregate({

        _sum: {

          price: true,

        },

        where: {

          order: {

            storeId,

          },

        },

      }),

      this.prisma.store.findUnique({

        where: {

          id: storeId,

        },

      }),

    ]);

    return {

      store,

      products,

      customers,

      orders,

      pendingOrders,

      deliveredOrders,

      revenue:

        revenue._sum.price ?? 0,

    };

  }

}