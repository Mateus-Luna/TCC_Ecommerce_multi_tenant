import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TenantMiddleware } from '../middleware/tenant.middleware';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaModule } from '../prisma/prisma.module';
import { StoreModule } from '../stores/stores/store.module';
import { ProductsModule } from '../products/products/products.module';

@Module({
  imports: [StoreModule, PrismaModule, ProductsModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, TenantMiddleware],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes('*');
  }
}
