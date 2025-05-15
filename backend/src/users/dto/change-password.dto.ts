import { ApiProperty } from "@nestjs/swagger"
import { IsString, MinLength, IsNotEmpty } from "class-validator"

export class ChangePasswordDto {
  @ApiProperty({
    example: "oldPassword123",
    description: "Current password",
  })
  @IsString()
  @IsNotEmpty()
  currentPassword: string

  @ApiProperty({
    example: "newPassword123",
    description: "New password",
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  newPassword: string

  @ApiProperty({
    example: "newPassword123",
    description: "Confirm new password",
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  confirmNewPassword: string
}
