import { Module } from '@nestjs/common';
import { StoreController } from './stores.controller';
import { StoreService } from './stores.service';

@Module({
  controllers: [StoreController],
  providers: [StoreService]
})
export class StoreModule {}
