import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { DrizzleModule } from "./drizzle/drizzle.module"
import { UsersModule } from "./users/users.module"
import { AuthModule } from "./auth/auth.module"
import { DashboardModule } from "../dashboard/dashboard.module" // Import DashboardModule

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DrizzleModule,
    UsersModule,
    AuthModule,
    DashboardModule, // Add DashboardModule here
  ],
})
export class AppModule {}
