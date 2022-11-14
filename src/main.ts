import refresh from 'passport-oauth2-refresh';
import passport from 'passport';
import cookieParser from 'cookie-parser';

import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

import { AppModule } from './app.module';
import { DiscordStrategy } from './auth/modules/discord/strategies/auth.strategy';
import { AUTH_STRATEGIES } from './common';

async function configureSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('WallPost')
    .setDescription('The WallPost API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}

async function configureAuth(app: INestApplication) {
  app.use(passport.initialize());
  app.use(cookieParser());
  app.enableCors({
    origin: ['localhost:3000'],
    credentials: true,
  });

  const discordStrategy = app.get(DiscordStrategy);
  refresh.use(AUTH_STRATEGIES.DISCORD_OAUTH2, discordStrategy);
}

async function startApp(app: INestApplication) {
  const configService = app.get(ConfigService);
  const port = configService.getOrThrow<number>('app.port');

  console.log(`Listening on port ${port}`);
  await app.listen(port);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  await configureAuth(app);

  await configureSwagger(app);

  await startApp(app);
}

bootstrap();
