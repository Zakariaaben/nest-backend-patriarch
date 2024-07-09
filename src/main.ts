import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets('uploads', {
    prefix: '/uploads',
  });

  app.useBodyParser('json');
  app.useBodyParser('urlencoded', { extended: true });
  await app.listen(3000);
}
bootstrap();
