import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { requestContext } from './common/middlewares/request-context.middleware';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  const port = parseInt(configService.get('PORT'), 10);

  app.enableCors({
    origin: '*',
    methods: ['POST'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization',
    maxAge: 86400
  });

  app.use(helmet());
  app.use(requestContext);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true
    })
  );

  await app.listen(port, '0.0.0.0', () => {
    Logger.log(`Server running on port ${port}`, 'Bootstrap');
  });
}

bootstrap();
