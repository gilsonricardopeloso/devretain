// backend/src/dashboard/dashboard.controller.ts
import { Controller, Get, UseGuards, Logger, Request } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { DashboardService } from "./dashboard.service";
import { AdminDashboardResponseDto } from "./dto/AdminDashboardResponse.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { UserRole } from "../users/dto/create-user.dto"; // Assuming UserRole is here or adjust path

interface RequestWithUser extends Request {
  user: {
    id: number;
    email: string;
    role: UserRole;
  };
}

@ApiTags("Dashboard")
@Controller("dashboard")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class DashboardController {
  private readonly logger = new Logger(DashboardController.name);

  constructor(private readonly dashboardService: DashboardService) {}

  @Get("admin-data")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Get admin dashboard data" })
  @ApiResponse({
    status: 200,
    description: "Successfully retrieved admin dashboard data.",
    type: AdminDashboardResponseDto,
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  @ApiResponse({ status: 403, description: "Forbidden. Admin role required." })
  async getAdminDashboardData(
    @Request() req: RequestWithUser
  ): Promise<AdminDashboardResponseDto> {
    this.logger.log(
      `User ${req.user.email} (Role: ${req.user.role}) requested admin dashboard data.`
    );
    return this.dashboardService.getAdminDashboardData();
  }
}
