// backend/src/dashboard/dashboard.module.ts
import { Module } from "@nestjs/common";
import { DashboardController } from "./dashboard.controller";
import { DashboardService } from "./dashboard.service";
// No DrizzleModule import needed here if DashboardService uses the global `db` instance

@Module({
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService], // Optional: export if other modules might use it
})
export class DashboardModule {}
