import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async registerAdmin(data: any) {
  const hashed = await bcrypt.hash(data.password, 10);

  return this.prisma.user.create({
    data: {
      email: data.email,
      password: hashed,
      role: 'ADMIN',
      storeId: data.storeId,
    },
  });
}

async registerCustomer(data: any) {
  const existing = await this.prisma.user.findUnique({ where: { email: data.email } });
  if (existing) throw new ConflictException('E-mail já cadastrado.');
  const hashed = await bcrypt.hash(data.password, 10);

  return this.prisma.user.create({
    data: {
      email: data.email,
      password: hashed,
      role: 'CUSTOMER',
      storeId: null,
    },
  });
}

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) throw new UnauthorizedException('E-mail ou senha incorretos.');

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) throw new UnauthorizedException('E-mail ou senha incorretos.');

    return {
      access_token: this.jwt.sign({
        sub: user.id,
        role: user.role,
        storeId: user.storeId,
  }),
};
  }

  async ensureMasterAdmin() {
    const email = 'admin@master.com';
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) return;
    await this.prisma.user.create({
      data: { email, password: await bcrypt.hash('123456', 10), role: 'MASTER_ADMIN' },
    });
  }
}
