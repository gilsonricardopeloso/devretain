import { Controller, Post, Body, UseGuards, Request } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { LocalAuthGuard } from "./guards/local-auth.guard"
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger"
import { LoginDto } from "./dto/login.dto"
import { Request as ExpressRequest } from "express"

interface RequestWithUser extends ExpressRequest {
  user: {
    id: number
    email: string
    role: string
  }
}

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post("login")
  @ApiOperation({ summary: "User login" })
  @ApiResponse({ status: 200, description: "Login successful" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async login(@Request() req: RequestWithUser, @Body() loginDto: LoginDto) {
    return this.authService.login(req.user)
  }
}
