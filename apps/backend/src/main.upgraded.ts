/**
 * AxiomX Backend Main Entry Point (Upgraded)
 * Enhanced with WebSocket support, CORS, compression, and monitoring
 */

import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe, Logger } from '@nestjs/common';
import * as compression from 'compression';
import * as helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // Enable compression
  app.use(compression());

  // Enable helmet for security
  app.use(helmet());

  // Enable CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('AxiomX API')
    .setDescription('Non-Custodial Crypto Super Aggregator API')
    .setVersion('1.0.0')
    .addBearerAuth()
    .addTag('Trading', 'Trading and order routing endpoints')
    .addTag('Auth', 'Authentication endpoints')
    .addTag('Keys', 'API key management')
    .addTag('Users', 'User management')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // WebSocket configuration
  const port = parseInt(process.env.PORT || '3000', 10);
  const host = process.env.HOST || '0.0.0.0';

  await app.listen(port, host);

  logger.log(`
╔════════════════════════════════════════════════════════════════════╗
║                    AxiomX Backend Started                          ║
║                                                                    ║
║  🚀 Server running on http://${host}:${port}                      ║
║  📚 API Docs available at http://${host}:${port}/api/docs         ║
║  🔌 WebSocket enabled for real-time updates                       ║
║  🔐 Security: Helmet + CORS enabled                               ║
║  📦 Compression: gzip enabled                                     ║
║                                                                    ║
║  Environment: ${process.env.NODE_ENV || 'development'}                        ║
║  Database: ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '5432'}    ║
║  Redis: ${process.env.REDIS_URL || 'redis://localhost:6379'}      ║
╚════════════════════════════════════════════════════════════════════╝
  `);
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
