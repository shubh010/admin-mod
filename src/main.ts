import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { fileURLToPath } from 'url';
import express from 'express';
import path from 'path';

export const __dirname = fileURLToPath(new URL('.', import.meta.url));

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(express.static(path.join(__dirname, '../public')));

  const config = new DocumentBuilder()
    .addSecurity('basic', {
      type: 'http',
      scheme: 'basic',
    })
    .setTitle('Admin APIS')
    .setDescription("API's for dynamic models")
    .setVersion('1.0')
    .addTag('models')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('apis', app, document);

  // console.log(__dirname);

  await app.listen(3000);
}
bootstrap();
