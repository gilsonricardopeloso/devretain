import { Injectable, Logger, ExecutionContext } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"
import { User } from "../../db/schema"

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  private readonly logger = new Logger(JwtAuthGuard.name)

  canActivate(context: ExecutionContext) {
    this.logger.log("Attempting to activate JWT guard")
    return super.canActivate(context)
  }

  handleRequest<TUser = User>(err: unknown, user: TUser, info: unknown): TUser {
    if (err || !user) {
      this.logger.error(
        `Authentication failed: ${err instanceof Error ? err.message : info instanceof Error ? info.message : "Unknown error"}`
      )
      throw err || new Error("Authentication failed")
    }

    const userEmail = (user as unknown as User).email
    this.logger.log(`User authenticated successfully: ${userEmail}`)
    return user
  }
}
