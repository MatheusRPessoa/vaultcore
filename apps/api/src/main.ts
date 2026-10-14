
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const port = Number(configService.get<string>('PORT') ?? 3333);

  app.setGlobalPrefix('api/v1');

  app.enableCors({
    origin: configService.get<string>('FRONTEND_URL') ?? 'http://localhost:3000',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  
  const swaggerConfig = new DocumentBuilder()
    .setTitle('VaultCore API')
    .setDescription('API REST do sistema bancário VaultCore')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(
    app,
    swaggerConfig,
  );

  SwaggerModule.setup('docs', app, document);

  await app.listen(port);

  console.log(`VaultCore API: http://localhost:${port}/api/v1`);
  console.log(`Swagger: http://localhost:${port}/docs`);
}

void bootstrap();
