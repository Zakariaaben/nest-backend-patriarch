import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets('uploads', {
    prefix: '/api/uploads',
  });
  app.enableCors();
  app.use(cookieParser());
  app.useBodyParser('json');
  app.useBodyParser('urlencoded', { extended: true });
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
