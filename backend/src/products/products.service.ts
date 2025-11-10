import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.product.findMany({
      where: { tenantId },
    });
  }

  async create(tenantId: string, data: any) {
    return this.prisma.product.create({
      data: {
        ...data,
        tenantId,
      },
    });
  }
}
