import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
  ForbiddenException,
} from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { UserRole } from "../../users/dto/create-user.dto"

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name)

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      "roles",
      [context.getHandler(), context.getClass()]
    )

    if (!requiredRoles) {
      this.logger.log("No roles required for this endpoint")
      return true
    }

    const { user } = context.switchToHttp().getRequest()

    if (!user) {
      this.logger.warn("No user found in request")
      throw new ForbiddenException("No user found in request")
    }

    this.logger.log(
      `Checking roles for user ${user.email}: required ${JSON.stringify(requiredRoles)}, has ${user.role}`
    )

    const hasRole = requiredRoles.some((role) => user.role === role)

    if (!hasRole) {
      this.logger.warn(
        `User ${user.email} with role ${user.role} does not have required roles: ${JSON.stringify(requiredRoles)}`
      )
      throw new ForbiddenException(
        `User does not have required roles: ${JSON.stringify(requiredRoles)}`
      )
    }

    this.logger.log(`User ${user.email} has required role`)
    return true
  }
}
