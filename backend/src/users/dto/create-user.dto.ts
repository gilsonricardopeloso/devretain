import { ApiProperty } from "@nestjs/swagger"
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsEnum,
} from "class-validator"

export enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

export class CreateUserDto {
  @ApiProperty({
    example: "john.doe@example.com",
    description: "The email of the user",
  })
  @IsEmail()
  @IsNotEmpty()
  email: string

  @ApiProperty({
    example: "John Doe",
    description: "The name of the user",
  })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({
    example: "password123",
    description: "The password of the user",
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string

  @ApiProperty({
    example: "user",
    description: "The role of the user",
    enum: UserRole,
    default: UserRole.USER,
  })
  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole
}
