import { IsBoolean, IsEnum, IsObject, IsOptional } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export enum Theme {
  LIGHT = "light",
  DARK = "dark",
  SYSTEM = "system",
}

export enum Language {
  PT_BR = "pt-BR",
  EN = "en",
}

export class UserPreferences {
  @ApiProperty({ default: true })
  @IsBoolean()
  notifications: boolean

  @ApiProperty({ enum: Theme, default: Theme.SYSTEM })
  @IsEnum(Theme)
  theme: Theme

  @ApiProperty({ enum: Language, default: Language.PT_BR })
  @IsEnum(Language)
  language: Language
}

export class UpdatePreferencesDto {
  @ApiProperty({ type: UserPreferences })
  @IsObject()
  preferences: UserPreferences
}
