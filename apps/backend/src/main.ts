import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuration CORS plus permissive
  app.enableCors({
    origin: true, // Permet toutes les origines en développement
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials: true,
    allowedHeaders: "Content-Type, Accept, Authorization",
  });

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
