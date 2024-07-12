import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule,/*  { bufferLogs: true } */);
  app.use(cookieSession({
    // stringa casuale per criptare le info memorizzate all'interno dei cookie
    keys: ['Canestro78']
  }))
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true
    })
  )
  // app.useLogger(app.get(Logger));
  await app.listen(3000);
}

bootstrap();
