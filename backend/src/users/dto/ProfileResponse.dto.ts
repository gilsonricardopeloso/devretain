// backend/src/users/dto/ProfileResponse.dto.ts
import { ApiProperty } from "@nestjs/swagger";
import { UserRole } from "./create-user.dto";
import { Theme, Language, UserPreferences } from "./update-preferences.dto";

// DTO for individual knowledge area in the profile
export class ProfileKnowledgeAreaDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  level: number;

  @ApiProperty({ type: Date, nullable: true })
  lastUpdated?: Date | null;
}

// DTO for individual career milestone in the profile
export class ProfileCareerMilestoneDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty({ nullable: true })
  description?: string | null;

  @ApiProperty()
  status: string;

  @ApiProperty({ type: Date, nullable: true })
  date?: Date | null;

  @ApiProperty({ type: Date, nullable: true })
  plannedDate?: Date | null;
}

// Main DTO for the profile response
export class ProfileResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ enum: UserRole })
  role: UserRole;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty({ type: Date, nullable: true })
  lastActivityAt?: Date | null;
  
  @ApiProperty({ type: () => UserPreferences })
  preferences: UserPreferences;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiProperty({ type: [ProfileKnowledgeAreaDto] })
  knowledgeAreas: ProfileKnowledgeAreaDto[];

  @ApiProperty({ type: [ProfileCareerMilestoneDto] })
  careerMilestones: ProfileCareerMilestoneDto[];
}
