import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import passport from 'passport';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

async function configureSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('WallPost')
    .setDescription('The WallPost API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  const configService = app.get(ConfigService);

  const port = configService.getOrThrow<number>('app.port');

  app.use(passport.initialize());

  app.enableCors({
    origin: ['localhost:3000'],
    credentials: true,
  });

  await configureSwagger(app);

  console.log(`Listening on port ${port}`);

  await app.listen(port);
}

bootstrap();
