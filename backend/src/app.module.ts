import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { JwtModule } from '@nestjs/jwt'
import { DatabaseConfig, JWTConfig } from './config/config.types';
import { TypeOrmModule } from '@nestjs/typeorm'
import { Campaign } from './entities/campaign.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Campaign]),
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configSevice: ConfigService) => {
        return {
          global: true,
          secret: configSevice.get<JWTConfig>('jwt')!.secret,
          signOptions: { expiresIn: '60s' },
        }
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const db = configService.get<DatabaseConfig>('database')!
        return {
          type: 'mysql',
          host: db.host,
          port: db.port,
          username: db.user,
          password: db.password,
          database: db.name,
          autoLoadEntities: true,
          synchronize: true,
        }
      },
    }),

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
