import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { Logger, ValidationPipe } from "@nestjs/common"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import { ConfigService } from "@nestjs/config"

async function bootstrap() {
  const logger = new Logger("Main")
  const app = await NestFactory.create(AppModule)

  // Enable CORS
  app.enableCors()

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    })
  )
  const config = app.get<ConfigService>(ConfigService)
  //
  const port = config.get<number>("SERVER_PORT") || 3000
  const nodeEnv = config.get<string>("NODE_ENV")
  const basePath = config.get<string>("BASEPATH")
  //
  // Swagger documentation
  const configDB = new DocumentBuilder()
    .setTitle("Life Inventory API")
    .setDescription("The Life Inventory API description")
    .setVersion("1.0")
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, configDB)
  SwaggerModule.setup("api", app, document)

  await app.listen(port, () => {
    logger.log(`🚀 Application is running on: ${basePath}:${port}/`)
    //${globalPrefix}
    logger.log(`Running in mode: ${nodeEnv} `)
  })
}

bootstrap()
