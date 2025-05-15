import { ApiProperty } from "@nestjs/swagger"
import { IsObject, IsOptional, ValidateNested } from "class-validator"
import { Type } from "class-transformer"

class NotificationPreferences {
  @ApiProperty({
    example: true,
    description: "Enable email notifications",
    default: true,
  })
  email: boolean

  @ApiProperty({
    example: true,
    description: "Enable push notifications",
    default: true,
  })
  push: boolean
}

class ThemePreferences {
  @ApiProperty({
    example: "light",
    description: "UI theme preference",
    enum: ["light", "dark", "system"],
    default: "system",
  })
  mode: "light" | "dark" | "system"

  @ApiProperty({
    example: "en",
    description: "Language preference",
    default: "en",
  })
  language: string
}

export class UserPreferencesDto {
  @ApiProperty({
    type: NotificationPreferences,
    description: "Notification preferences",
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => NotificationPreferences)
  notifications?: NotificationPreferences

  @ApiProperty({
    type: ThemePreferences,
    description: "Theme preferences",
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => ThemePreferences)
  theme?: ThemePreferences

  @ApiProperty({
    type: Object,
    description: "Additional custom preferences",
    additionalProperties: true,
  })
  @IsOptional()
  @IsObject()
  custom?: Record<string, string | number | boolean>
}
