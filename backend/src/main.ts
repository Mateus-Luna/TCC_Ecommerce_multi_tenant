import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { AuthService } from './auth/auth.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.get(AuthService).ensureMasterAdmin();

  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
