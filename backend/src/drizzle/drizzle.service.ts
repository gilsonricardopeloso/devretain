import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import * as schema from "../db/schema"

@Injectable()
export class DrizzleService {
  private readonly pool: Pool
  private readonly db

  constructor(private configService: ConfigService) {
    this.pool = new Pool({
      host: this.configService.get("DB_HOST"),
      port: this.configService.get("DB_PORT"),
      user: this.configService.get("DB_USER"),
      password: this.configService.get("DB_PASSWORD"),
      database: this.configService.get("DB_NAME"),
    })

    this.db = drizzle(this.pool, { schema })
  }

  getDb() {
    return this.db
  }
}
