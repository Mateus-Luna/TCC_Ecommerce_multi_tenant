import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.product.findMany({
      where: {
        tenantId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

 
  async findOne(id: string, tenantId: string) {
    const product = await this.prisma.product.findFirst({
      where: {
        id,
        tenantId,
      },
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado.');
    }

    return product;
  }


  async create(
    tenantId: string,
    dto: CreateProductDto,
  ) {
    return this.prisma.product.create({
      data: {
        ...dto,
        tenantId,
      },
    });
  }


  async update(
    id: string,
    tenantId: string,
    dto: UpdateProductDto,
  ) {
    await this.findOne(id, tenantId);

    return this.prisma.product.update({
      where: {
        id,
      },
      data: dto,
    });
  }

  async remove(id: string, tenantId: string) {
    await this.findOne(id, tenantId);

  const orderItemsCount = await this.prisma.orderItem.count({
    where: {
      productId: id,
    },
  });

  if (orderItemsCount > 0) {
    throw new BadRequestException(
      'Não é possível excluir um produto que possui pedidos associados.',
    );
  }

  return this.prisma.product.delete({
    where: {
      id,
    },
  });
  }
}