import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Query,
  Request,
  Logger,
} from "@nestjs/common"
import { UsersService } from "./users.service"
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { RolesGuard } from "../auth/guards/roles.guard"
import { Roles } from "../auth/decorators/roles.decorator"
import { CreateUserDto } from "./dto/create-user.dto"
import { UpdateUserDto } from "./dto/update-user.dto"
import { ChangePasswordDto } from "./dto/change-password.dto"
import { UserRole } from "./dto/create-user.dto"
import { Request as ExpressRequest } from "express"
import { UpdatePreferencesDto } from "./dto/update-preferences.dto"

interface RequestWithUser extends ExpressRequest {
  user: {
    id: number
    email: string
    role: UserRole
  }
}

@ApiTags("users")
@Controller("users")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsersController {
  private readonly logger = new Logger(UsersController.name)

  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Create a new user" })
  @ApiResponse({ status: 201, description: "User created successfully" })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 409, description: "User already exists" })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto)
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Get all users" })
  @ApiResponse({ status: 200, description: "Return all users" })
  async findAll(@Request() req: RequestWithUser) {
    this.logger.log(
      `User requesting all users: ${req.user.email} with role: ${req.user.role}`
    )
    const users = await this.usersService.findAll()
    this.logger.log(`Found ${users.length} users`)
    return users
  }

  @Get("search")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Search users by name" })
  @ApiResponse({ status: 200, description: "Return matching users" })
  search(@Query("q") query: string) {
    return this.usersService.searchUsers(query)
  }

  @Get("profile")
  @ApiOperation({ summary: "Get current user profile" })
  @ApiResponse({ status: 200, description: "Return user profile" })
  getProfile(@Request() req: RequestWithUser) {
    return this.usersService.getProfile(req.user.id)
  }

  @Get("preferences")
  @ApiOperation({ summary: "Get current user preferences" })
  @ApiResponse({ status: 200, description: "Return current user preferences" })
  getPreferences(@Request() req: RequestWithUser) {
    return this.usersService.getPreferences(req.user.id)
  }

  @Patch("preferences")
  @ApiOperation({ summary: "Update current user preferences" })
  @ApiResponse({ status: 200, description: "Preferences updated successfully" })
  updatePreferences(
    @Request() req: RequestWithUser,
    @Body() updatePreferencesDto: UpdatePreferencesDto
  ) {
    return this.usersService.updatePreferences(
      req.user.id,
      updatePreferencesDto
    )
  }

  @Get(":id")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Get user by id" })
  @ApiResponse({ status: 200, description: "Return the user" })
  @ApiResponse({ status: 404, description: "User not found" })
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(+id)
  }

  @Patch(":id")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Update user" })
  @ApiResponse({ status: 200, description: "User updated successfully" })
  @ApiResponse({ status: 404, description: "User not found" })
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto)
  }

  @Delete(":id")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Delete user" })
  @ApiResponse({ status: 200, description: "User deleted successfully" })
  @ApiResponse({ status: 404, description: "User not found" })
  remove(@Param("id") id: string) {
    return this.usersService.remove(+id)
  }

  @Post("change-password")
  @ApiOperation({ summary: "Change user password" })
  @ApiResponse({ status: 200, description: "Password changed successfully" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  changePassword(
    @Request() req: RequestWithUser,
    @Body() changePasswordDto: ChangePasswordDto
  ) {
    return this.usersService.changePassword(req.user.id, changePasswordDto)
  }
}
