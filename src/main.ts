import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { EnvService } from './environment/env.service';
import * as cookieParser from 'cookie-parser';
import { GlobalExceptionFilter } from './exception/global-exception.filter';
import { LoggerService } from './logger/logger.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('The API documentation for your project')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.use(cookieParser());
  const envService = app.get(EnvService);
  const PORT = envService.httpPort;
  const CLIENT_URL = envService.clientURL;

  if (envService.isDevelopment) {
    console.log(`Swagger available at http://localhost:${PORT}/api`);
  }

  app.enableCors({
    origin: CLIENT_URL,
    methods: 'GET,POST,PUT,PATCH,DELETE',
    credentials: true,
    exposedHeaders: ['Content-Disposition', 'x-timestamp', 'x-sent'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalFilters(new GlobalExceptionFilter(new LoggerService()));

  await app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
}
bootstrap();
