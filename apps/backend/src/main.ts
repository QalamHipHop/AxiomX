import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as compression from 'compression';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  // Security: Helmet
  app.use(helmet());

  // Optimization: Compression
  app.use(compression());

  // Logging: Use Winston
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  // Security: Hardened CORS
  const allowedOrigins = process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'];
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  // Versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Validation: Advanced validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
    errorHttpStatusCode: 422,
  }));

  // Swagger: Hardened documentation
  const config = new DocumentBuilder()
    .setTitle('AxiomX API')
    .setDescription('The AxiomX Super Aggregator API - High Performance Trading Backend')
    .setVersion('2.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter JWT token',
      in: 'header',
    })
    .addTag('Auth', 'Authentication & Token Management')
    .addTag('Users', 'User Profile & Identity Vault')
    .addTag('Trading', 'Market Data & Execution Engine')
    .addTag('AI', 'Intelligent Trading Assistants')
    .addTag('Keys', 'API Key Management & Security')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);
  
  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  logger.log(`AxiomX Backend is running on port: ${port} in ${process.env.NODE_ENV || 'development'} mode`);
}

bootstrap();
