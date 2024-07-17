import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { User } from './users/user.entity';
import { Report } from './reports/report.entity';
import { dataSourceOptions } from '../db/data-source';
import * as ormconfig from '../ormconfig'
const cookieSession = require('cookie-session');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
  //   type: 'sqlite',
  //   database: 'db.sqlite',
  //   entities: [User, Report],
  //   synchronize: true,
  // }),
    TypeOrmModule.forRoot(dataSourceOptions),
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
  constructor(private configService: ConfigService){}
  //COOKIE SESSION APPLICATO GLOBALMENTE A TUTTE LE ROUTES (PRIMA IN MAIN MA PER TEXT E2E è STATO SPOSTATO QUI IN APP,MODULE)
  configure(consumer: MiddlewareConsumer){
    consumer.apply(cookieSession({
      // stringa casuale per criptare le info memorizzate all'interno dei cookie
      keys: [this.configService.get('COOKIE_KEY')]
    })).forRoutes('*');
  }
}
