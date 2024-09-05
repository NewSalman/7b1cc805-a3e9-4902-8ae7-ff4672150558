import { NestApplication, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as hbs from "hbs";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const config = new DocumentBuilder()
  .setTitle("test Ambisius")
  .setVersion("1.0.0")
  .build();

  const doc = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup("api", app, doc);


  app.useStaticAssets(join(__dirname, "..", "public"));
  app.setBaseViewsDir(join(__dirname, "..", "views"));
  hbs.registerPartials(join(__dirname, "..", "views", "layouts"));
  app.setViewEngine("hbs");
  app.set("view options", { layout: 'layouts/layout'});


  await app.listen(3000);
}

bootstrap();
