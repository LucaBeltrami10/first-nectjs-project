import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use()

  
  /*! APPLICATO IN APP.MODULE PER RISOLVERE PROBLEMA TEST E2E */
  /* app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true
    })
  ) */


  await app.listen(3000);
}

bootstrap();
