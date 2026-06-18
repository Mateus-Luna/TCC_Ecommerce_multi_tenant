import { Injectable } from '@nestjs/common';
import { UpdateStoreDto } from './dto/update-store.dto';
import { CreateStoreDto } from './dto/create-store.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class StoreService {
    constructor(private prisma: PrismaService) {}

  create(dto: CreateStoreDto) {
    return this.prisma.store.create({
      data: dto,
    });
  }

  findAll() {
    return this.prisma.store.findMany();
  }

  findOne(id: string) {
    return this.prisma.store.findUnique({
      where: { id },
    });
  }

  update(id: string, dto: UpdateStoreDto) {
    return this.prisma.store.update({
      where: { id },
      data: dto,
    });
  }

  remove(id: string) {
    return this.prisma.store.delete({
      where: { id },
    });
  }
}
