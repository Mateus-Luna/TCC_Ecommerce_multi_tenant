import { Module } from '@nestjs/common';
import { StoreController } from './stores.controller';
import { StoreService } from './stores.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [StoreController],
  providers: [StoreService]
})
export class StoreModule {}
