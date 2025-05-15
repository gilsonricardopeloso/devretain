import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty, IsString } from "class-validator"

export class LoginDto {
  @ApiProperty({
    example: "user@emailxyz.com",
    description: "The email of the user",
  })
  @IsEmail()
  @IsNotEmpty()
  email: string

  @ApiProperty({
    example: "123456",
    description: "The password of the user",
  })
  @IsString()
  @IsNotEmpty()
  password: string
}
