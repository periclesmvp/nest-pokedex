import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(  
    new ValidationPipe({ 
      whitelist: true, 
      forbidNonWhitelisted: true, 
    }) 
  );

  // Esto sirve para ponerle a toda los endpoint detras el prefijo api
  app.setGlobalPrefix("api/v2")
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
