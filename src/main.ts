import { UnauthorizedException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const allowList = [
    'http://fireking5997.com',
    'http://www.fireking5997.com',
    'http://localhost:3000',
    process.env.BASE_URL,
    `${process.env.BASE_URL}:3000`,
  ];

  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: (origin, callback) => {
      const allowed = allowList.includes(origin);
      if (allowed) callback(null, true);
      else throw new UnauthorizedException('UnAccepted Cors');
    },
    credentials: true,
  });

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  await app.listen(process.env.PORT);
}
bootstrap();
