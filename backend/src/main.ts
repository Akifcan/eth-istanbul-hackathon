import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AppConfig } from './config/config.types';
import { ConfigService } from '@nestjs/config'
import helmet from 'helmet'
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService)!


  app.useGlobalPipes(new ValidationPipe())
  app.use(helmet())
  app.enableCors()

  await app.listen(configService.get<AppConfig>('app')!.port)
}
bootstrap();
