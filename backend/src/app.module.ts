import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { DrizzleModule } from "./drizzle/drizzle.module"
import { UsersModule } from "./users/users.module"
import { AuthModule } from "./auth/auth.module"

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DrizzleModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
