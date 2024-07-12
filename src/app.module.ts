import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { User } from './users/user.entity';
import { Report } from './reports/report.entity';
import { LoggerModule } from 'nestjs-pino'

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'sqlite',
    database: 'db.sqlite',
    entities: [User, Report],
    synchronize: true,
  }),
    UsersModule, 
    ReportsModule,
    // LoggerModule.forRoot({
    //   pinoHttp: {
    //     name: 'LoggerURL',
    //     transport: { target: 'pino-pretty' },
    //     level: 'debug',
    //   },
    // }),
    ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
