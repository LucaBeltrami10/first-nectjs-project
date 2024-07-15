import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { User } from './users/user.entity';
import { Report } from './reports/report.entity';
import { LoggerModule } from 'nestjs-pino'
const cookieSession = require('cookie-session');

@Module({
  imports: [
    TypeOrmModule.forRoot({
    type: 'sqlite',
    database: 'db.sqlite',
    entities: [User, Report],
    synchronize: true,
  }),
    UsersModule, 
    ReportsModule,
    ],
  controllers: [AppController],
  providers: [
    AppService,
    //VALIDATION APPLICATO GLOBALMENTE (PRIMA IN MAIN MA PER TEXT E2E è STATO SPOSTATO QUI IN APP,MODULE)
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      })
    }

  ],
})
export class AppModule {

  //COOKIE SESSION APPLICATO GLOBALMENTE A TUTTE LE ROUTES (PRIMA IN MAIN MA PER TEXT E2E è STATO SPOSTATO QUI IN APP,MODULE)
  configure(consumer: MiddlewareConsumer){
    consumer.apply(cookieSession({
      // stringa casuale per criptare le info memorizzate all'interno dei cookie
      keys: ['Canestro78']
    })).forRoutes('*');
  }
}
