import { Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { DrizzleService } from "./drizzle.service"

@Module({
  imports: [ConfigModule],
  providers: [DrizzleService],
  exports: [DrizzleService],
})
export class DrizzleModule {}
