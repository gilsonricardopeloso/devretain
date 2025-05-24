import {
  Injectable,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
  ForbiddenException,
} from "@nestjs/common"
import { DrizzleService } from "../drizzle/drizzle.service"
import { eq, like, and, desc, sql } from "drizzle-orm"
import * as bcrypt from "bcrypt"
import {
  users as usersTable,
  knowledgeAreas as knowledgeAreasTable,
  userKnowledgeAreas as userKnowledgeAreasTable,
  careerMilestones as careerMilestonesTable,
  User, // Keep User type
  NewUser, // Keep NewUser type
} from "../db/schema"
import { ChangePasswordDto } from "./dto/change-password.dto"
import { UserPreferencesDto } from "./dto/user-preferences.dto"
import { CreateUserDto } from "./dto/create-user.dto"
import { UpdateUserDto } from "./dto/update-user.dto"
import {
  UpdatePreferencesDto,
  UserPreferences,
} from "./dto/update-preferences.dto"
import {
  ProfileResponseDto,
  ProfileKnowledgeAreaDto,
  ProfileCareerMilestoneDto,
} from "./dto/ProfileResponse.dto"
import { db } from "../db"

interface PaginationOptions {
  page?: number
  limit?: number
}

@Injectable()
export class UsersService {
  constructor(private readonly drizzleService: DrizzleService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10)
    const [user] = await db
      .insert(usersTable)
      .values({
        ...createUserDto,
        password: hashedPassword,
      })
      .returning()
    return user
  }

  async findAll(): Promise<Omit<User, "password">[]> {
    const db = this.drizzleService.getDb()
    const allUsers = await db.select().from(usersTable)
    return allUsers.map(({ password, ...user }) => user)
  }

  async findOne(id: number): Promise<User> {
    const db = this.drizzleService.getDb()
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id))
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`)
    }
    return user
  }

  async findOneByEmail(email: string): Promise<User | null> {
    const db = this.drizzleService.getDb()
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
    return user || null
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10)
    }
    const db = this.drizzleService.getDb()
    const [user] = await db
      .update(usersTable)
      .set({
        ...updateUserDto,
        updatedAt: new Date(),
      })
      .where(eq(usersTable.id, id))
      .returning()
    return user
  }

  async remove(id: number): Promise<void> {
    const db = this.drizzleService.getDb()
    await db.delete(usersTable).where(eq(usersTable.id, id))
  }

  async changePassword(
    userId: number,
    changePasswordDto: ChangePasswordDto
  ): Promise<void> {
    const user = await this.findOne(userId)

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.password
    )
    if (!isPasswordValid) {
      throw new UnauthorizedException("Current password is incorrect")
    }

    // Verify new passwords match
    if (
      changePasswordDto.newPassword !== changePasswordDto.confirmNewPassword
    ) {
      throw new UnauthorizedException("New passwords do not match")
    }

    // Hash and update new password
    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10)
    const db = this.drizzleService.getDb()
    await db
      .update(usersTable)
      .set({
        password: hashedPassword,
        updatedAt: new Date(),
      })
      .where(eq(usersTable.id, userId))
  }

  async searchUsers(query: string): Promise<User[]> {
    const db = this.drizzleService.getDb()
    return db
      .select()
      .from(usersTable)
      .where(like(usersTable.name, `%${query}%`))
  }

  async getProfile(userId: number): Promise<ProfileResponseDto> {
    // 1. Fetch user details (excluding password)
    const user = await this.findOne(userId)
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`)
    }
    const { password, ...userProfileData } = user

    // 2. Fetch user's knowledge areas
    const userKnowledgeAreasData = await db
      .select({
        id: knowledgeAreasTable.id, // Use knowledgeAreaId for the DTO id
        name: knowledgeAreasTable.name,
        level: userKnowledgeAreasTable.level,
        lastUpdated: userKnowledgeAreasTable.lastUpdated,
      })
      .from(userKnowledgeAreasTable)
      .innerJoin(
        knowledgeAreasTable,
        eq(userKnowledgeAreasTable.knowledgeAreaId, knowledgeAreasTable.id)
      )
      .where(eq(userKnowledgeAreasTable.userId, userId))

    const profileKnowledgeAreas: ProfileKnowledgeAreaDto[] =
      userKnowledgeAreasData.map((uka) => ({
        id: uka.id,
        name: uka.name,
        level: uka.level,
        lastUpdated: uka.lastUpdated,
      }))

    // 3. Fetch user's career milestones
    const userCareerMilestonesData = await db
      .select({
        id: careerMilestonesTable.id,
        title: careerMilestonesTable.title,
        description: careerMilestonesTable.description,
        status: careerMilestonesTable.status,
        date: careerMilestonesTable.date,
        plannedDate: careerMilestonesTable.plannedDate,
      })
      .from(careerMilestonesTable)
      .where(eq(careerMilestonesTable.userId, userId))
      .orderBy(desc(careerMilestonesTable.date || careerMilestonesTable.plannedDate || careerMilestonesTable.createdAt))


    const profileCareerMilestones: ProfileCareerMilestoneDto[] =
      userCareerMilestonesData.map((cm) => ({
        id: cm.id,
        title: cm.title,
        description: cm.description,
        status: cm.status,
        date: cm.date,
        plannedDate: cm.plannedDate,
      }))

    // 4. Combine into ProfileResponseDto
    return {
      ...userProfileData,
      knowledgeAreas: profileKnowledgeAreas,
      careerMilestones: profileCareerMilestones,
    }
  }

  async updateStatus(id: number, isActive: boolean): Promise<User> {
    const user = await this.findOne(id)
    if (user.role === "admin" && !isActive) {
      throw new ForbiddenException("Cannot deactivate admin users")
    }

    const db = this.drizzleService.getDb()
    const [updatedUser] = await db
      .update(usersTable)
      .set({
        isActive,
        updatedAt: new Date(),
      })
      .where(eq(usersTable.id, id))
      .returning()

    return updatedUser
  }

  async updatePreferences(
    userId: number,
    updatePreferencesDto: UpdatePreferencesDto
  ): Promise<User> {
    const user = await this.findOne(userId)
    const db = this.drizzleService.getDb()
    const [updatedUser] = await db
      .update(usersTable)
      .set({
        preferences: updatePreferencesDto.preferences,
        updatedAt: new Date(),
      })
      .where(eq(usersTable.id, userId))
      .returning()

    return updatedUser
  }

  async updateLastActivity(userId: number): Promise<void> {
    const db = this.drizzleService.getDb()
    await db
      .update(usersTable)
      .set({
        lastActivityAt: new Date(),
      })
      .where(eq(usersTable.id, userId))
  }

  async findAllWithPagination(options: PaginationOptions = {}): Promise<{
    data: User[]
    total: number
    page: number
    limit: number
  }> {
    const { page = 1, limit = 10 } = options
    const offset = (page - 1) * limit

    const db = this.drizzleService.getDb()
    const data = await db
      .select()
      .from(usersTable)
      .orderBy(desc(usersTable.createdAt))
      .limit(limit)
      .offset(offset)

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(usersTable)

    return {
      data,
      total: Number(count),
      page,
      limit,
    }
  }

  async findInactiveUsers(days: number = 30): Promise<User[]> {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)

    const db = this.drizzleService.getDb()
    return db
      .select()
      .from(usersTable)
      .where(
        and(
          eq(usersTable.isActive, true),
          like(usersTable.lastActivityAt, cutoffDate.toISOString())
        )
      )
  }

  async getPreferences(userId: number): Promise<UserPreferences> {
    const user = await this.findOne(userId)
    return user.preferences as UserPreferences
  }
}
