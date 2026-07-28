import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TenantMiddleware } from '../middleware/tenant.middleware';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaModule } from '../prisma/prisma.module';
import { StoreModule } from '../stores/stores/store.module';
import { ProductsModule } from '../products/products/products.module';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { OrdersModule } from '../orders/orders.module';
import { DashboardModule } from "../dashboard/dashboard.module";

@Module({
  imports: [StoreModule, PrismaModule, ProductsModule, UsersModule, AuthModule, OrdersModule, DashboardModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, TenantMiddleware],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes('*');
  }
}
