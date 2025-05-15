import { db } from "./index"
import { users } from "./schema"
import * as bcrypt from "bcrypt"
import { Theme, Language } from "../users/dto/update-preferences.dto"

async function seed() {
  try {
    // Limpa as tabelas existentes
    await db.delete(users)

    // Cria usuário admin
    const adminPassword: string = await bcrypt.hash("admin123", 10)
    await db.insert(users).values({
      name: "Admin",
      email: "admin@example.com",
      password: adminPassword,
      role: "admin",
      isActive: true,
      preferences: {
        notifications: true,
        theme: Theme.SYSTEM,
        language: Language.PT_BR,
      },
    })

    // Cria usuário normal
    const userPassword: string = await bcrypt.hash("user123", 10)
    await db.insert(users).values({
      name: "User",
      email: "user@example.com",
      password: userPassword,
      role: "user",
      isActive: true,
      preferences: {
        notifications: true,
        theme: Theme.LIGHT,
        language: Language.PT_BR,
      },
    })

    console.log("Seed concluído com sucesso!")
  } catch (error) {
    console.error("Erro ao executar seed:", error)
  } finally {
    process.exit(0)
  }
}

seed()
