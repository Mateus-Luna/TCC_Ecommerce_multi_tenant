import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { MasterController } from './master.controller';
import { MasterService } from './master.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [MasterController],
  providers: [MasterService],
})
export class MasterModule {}
