import { Injectable, Logger, UnauthorizedException } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"
import { UsersService } from "../../users/users.service"

interface JwtPayload {
  sub: number
  email: string
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name)

  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || "life-inventory-secret-key-2025",
      passReqToCallback: true,
    })
    this.logger.log("JWT Strategy initialized")
  }

  async validate(request: any, payload: JwtPayload) {
    this.logger.log(`Validating JWT payload: ${JSON.stringify(payload)}`)

    try {
      const user = await this.usersService.findOne(payload.sub)

      if (!user) {
        this.logger.warn(
          `User not found for payload: ${JSON.stringify(payload)}`
        )
        throw new UnauthorizedException("User not found")
      }

      if (!user.isActive) {
        this.logger.warn(`User ${user.email} is not active`)
        throw new UnauthorizedException("User is not active")
      }

      this.logger.log(
        `User validated successfully: ${user.email} with role ${user.role}`
      )
      return user
    } catch (error) {
      this.logger.error(`Error validating user: ${error.message}`)
      throw new UnauthorizedException("Invalid token")
    }
  }
}
