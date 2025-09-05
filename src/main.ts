import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*', // Allow requests from any origin
    Credentials: true, // Allow cookies and authentication headers
  });
  // Enable validation pipe globally for all incoming requests
  app.useGlobalPipes(
    new ValidationPipe({
      //Removes (strips out) any properties that are not in your DTO.
      whitelist: true,
      //Instead of silently stripping out unwanted properties, it throws an error if extra properties exist.
      forbidNonWhitelisted: true,
      //converts input into DTO class instances so validation + typing work correctly(type of fields)
      transform: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((err) => {
  console.error('Error during bootstrap:', err);
});
