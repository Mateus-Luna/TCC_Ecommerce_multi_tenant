import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

const safeUser = { id: true, email: true, role: true, storeId: true, createdAt: true, updatedAt: true };

@Injectable()
export class MasterService {
  constructor(private readonly prisma: PrismaService) {}

  async listStores() {
    return this.prisma.store.findMany({
      include: { users: { where: { role: 'ADMIN' }, select: safeUser } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createStore(data: any) {
    const { adminIds = [], ...store } = data;
    await this.assertAvailableAdmins(adminIds);
    return this.prisma.$transaction(async (tx) => {
      const created = await tx.store.create({ data: store });
      if (adminIds.length) await tx.user.updateMany({ where: { id: { in: adminIds }, role: 'ADMIN', storeId: null }, data: { storeId: created.id } });
      return tx.store.findUnique({ where: { id: created.id }, include: { users: { where: { role: 'ADMIN' }, select: safeUser } } });
    });
  }

  async updateStore(id: string, data: any) {
    const { adminIds, ...store } = data;
    if (adminIds !== undefined) {
      await this.assertAvailableAdmins(adminIds, id);
      return this.prisma.$transaction(async (tx) => {
        await tx.user.updateMany({ where: { storeId: id, role: 'ADMIN' }, data: { storeId: null } });
        if (adminIds.length) await tx.user.updateMany({ where: { id: { in: adminIds }, role: 'ADMIN', storeId: null }, data: { storeId: id } });
        return tx.store.update({ where: { id }, data: store, include: { users: { where: { role: 'ADMIN' }, select: safeUser } } });
      });
    }
    return this.prisma.store.update({ where: { id }, data: store, include: { users: { where: { role: 'ADMIN' }, select: safeUser } } });
  }

  async removeStore(id: string) {
    return this.prisma.$transaction(async (tx) => {
      await tx.orderItem.deleteMany({ where: { order: { storeId: id } } });
      await tx.order.deleteMany({ where: { storeId: id } });
      await tx.product.deleteMany({ where: { tenantId: id } });
      await tx.user.updateMany({ where: { storeId: id }, data: { storeId: null } });
      return tx.store.delete({ where: { id } });
    });
  }

  listAdmins(available?: boolean) {
    return this.prisma.user.findMany({ where: { role: 'ADMIN', ...(available ? { storeId: null } : {}) }, select: safeUser, orderBy: { email: 'asc' } });
  }

  async createAdmin(data: { email: string; password: string }) {
    const exists = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (exists) throw new BadRequestException('E-mail já cadastrado.');
    return this.prisma.user.create({ data: { email: data.email, password: await bcrypt.hash(data.password, 10), role: 'ADMIN' }, select: safeUser });
  }

  async updateAdmin(id: string, data: { email?: string; password?: string }) {
    await this.getAdmin(id);
    const update: any = { ...data };
    if (data.password) update.password = await bcrypt.hash(data.password, 10);
    return this.prisma.user.update({ where: { id }, data: update, select: safeUser });
  }

  async assignAdmin(id: string, storeId: string | null) {
    const admin = await this.getAdmin(id);
    if (storeId) {
      const store = await this.prisma.store.findUnique({ where: { id: storeId } });
      if (!store) throw new NotFoundException('Loja não encontrada.');
      if (admin.storeId && admin.storeId !== storeId) throw new BadRequestException('Administrador já está associado a outra loja.');
    }
    return this.prisma.user.update({ where: { id }, data: { storeId }, select: safeUser });
  }

  private async getAdmin(id: string) {
    const admin = await this.prisma.user.findFirst({ where: { id, role: 'ADMIN' } });
    if (!admin) throw new NotFoundException('Administrador não encontrado.');
    return admin;
  }

  private async assertAvailableAdmins(ids: string[], currentStoreId?: string) {
    if (new Set(ids).size !== ids.length) throw new BadRequestException('Administradores duplicados.');
    const admins = await this.prisma.user.findMany({ where: { id: { in: ids }, role: 'ADMIN' } });
    if (admins.length !== ids.length || admins.some((admin) => admin.storeId && admin.storeId !== currentStoreId)) {
      throw new BadRequestException('Um ou mais administradores não estão disponíveis.');
    }
  }
}
