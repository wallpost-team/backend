import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { patchNestJsSwagger } from 'nestjs-zod';
import passport from 'passport';
import { AppModule } from './app.module';

async function configureSwagger(app: INestApplication) {
  patchNestJsSwagger();
  const config = new DocumentBuilder()
    .setTitle('WallPost')
    .setDescription('The WallPost API description')
    .setVersion('1.0')
    .addSecurity('Authorization', {
      type: 'apiKey',
      in: 'cookie',
      name: 'Authorization',
    })
    .addSecurity('Refresh', {
      type: 'apiKey',
      in: 'cookie',
      name: 'Authorization',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}

async function configureAuth(app: INestApplication, config: ConfigService) {
  const cookieSecret = config.getOrThrow<string>('app.cookieSecret');
  app.use(passport.initialize());
  app.use(cookieParser(cookieSecret));
  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: true,
  });
}

async function startApp(app: INestApplication, config: ConfigService) {
  const port = config.getOrThrow<number>('app.port');
  console.log(`Listening on port ${port}`);
  await app.listen(port);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.setGlobalPrefix('api');

  await configureAuth(app, config);

  await configureSwagger(app);

  await startApp(app, config);
}

bootstrap();
