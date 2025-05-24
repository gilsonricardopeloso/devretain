import { db } from "./index"
import {
  users,
  knowledgeAreas,
  userKnowledgeAreas,
  careerMilestones,
} from "./schema"
import * as bcrypt from "bcrypt"
import { Theme, Language } from "../users/dto/update-preferences.dto"

async function seed() {
  try {
    // Clear existing tables
    await db.delete(careerMilestones)
    await db.delete(userKnowledgeAreas)
    await db.delete(knowledgeAreas)
    await db.delete(users)

    // --- Create Users ---
    const adminPassword = await bcrypt.hash("admin123", 10)
    const [adminUser] = await db
      .insert(users)
      .values({
        name: "Admin User",
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
      .returning()

    const user1Password = await bcrypt.hash("user1pass", 10)
    const [user1] = await db
      .insert(users)
      .values({
        name: "User1 (Alice)",
        email: "user1@example.com",
        password: user1Password,
        role: "user",
        isActive: true,
        preferences: {
          notifications: true,
          theme: Theme.LIGHT,
          language: Language.EN,
        },
      })
      .returning()

    const user2Password = await bcrypt.hash("user2pass", 10)
    const [user2] = await db
      .insert(users)
      .values({
        name: "User2 (Bob)",
        email: "user2@example.com",
        password: user2Password,
        role: "user",
        isActive: true,
        preferences: {
          notifications: false,
          theme: Theme.DARK,
          language: Language.EN, // Changed from Language.ES
        },
      })
      .returning()

    const johnDoePassword = await bcrypt.hash("johndoe123", 10)
    const [johnDoe] = await db
      .insert(users)
      .values({
        name: "John Doe",
        email: "johndoe@example.com",
        password: johnDoePassword,
        role: "user",
        isActive: true,
        preferences: {
          notifications: true,
          theme: Theme.SYSTEM,
          language: Language.PT_BR,
        },
      })
      .returning()

    const janeSmithPassword = await bcrypt.hash("janesmith123", 10)
    const [janeSmith] = await db
      .insert(users)
      .values({
        name: "Jane Smith",
        email: "janesmith@example.com",
        password: janeSmithPassword,
        role: "user",
        isActive: true,
        preferences: {
          notifications: true,
          theme: Theme.LIGHT,
          language: Language.EN,
        },
      })
      .returning()

    console.log("Users seeded.")

    // --- Create Knowledge Areas ---
    const [kaFrontendArch] = await db
      .insert(knowledgeAreas)
      .values({ name: "Frontend Architecture", description: "Principles of frontend system design." })
      .returning()

    const [kaBackendAPI] = await db
      .insert(knowledgeAreas)
      .values({ name: "Backend API Design", description: "Designing robust backend APIs." })
      .returning()

    const [kaDbOptimization] = await db
      .insert(knowledgeAreas)
      .values({ name: "Database Optimization", description: "Techniques for optimizing database performance." })
      .returning()
      
    const [kaSecurity] = await db
      .insert(knowledgeAreas)
      .values({ name: "Security Protocols", description: "Implementing security best practices." })
      .returning()

    const [kaCICD] = await db
      .insert(knowledgeAreas)
      .values({ name: "CI/CD Pipeline", description: "Continuous Integration and Delivery pipelines." })
      .returning()

    const [kaReactDesign] = await db
      .insert(knowledgeAreas)
      .values({ name: "React Component Design", description: "Best practices for React components." })
      .returning()

    const [kaUnitTesting] = await db
      .insert(knowledgeAreas)
      .values({ name: "Unit Testing", description: "Writing effective unit tests." })
      .returning()

    console.log("Knowledge Areas seeded.")

    // --- Create User Knowledge Areas ---
    const now = new Date()

    // For Dashboard (isOwner: true)
    await db.insert(userKnowledgeAreas).values([
      {
        userId: johnDoe.id,
        knowledgeAreaId: kaFrontendArch.id,
        level: 4,
        vulnerabilityScore: 8,
        isOwner: true,
        lastUpdated: now,
      },
      {
        userId: janeSmith.id,
        knowledgeAreaId: kaBackendAPI.id,
        level: 5,
        vulnerabilityScore: 3,
        isOwner: true,
        lastUpdated: now,
      },
      { // Additional owner for dashboard example
        userId: adminUser.id, 
        knowledgeAreaId: kaSecurity.id,
        level: 5,
        vulnerabilityScore: 2,
        isOwner: true,
        lastUpdated: now,
      },
    ])

    // For Profile (User1 - Alice)
    await db.insert(userKnowledgeAreas).values([
      {
        userId: user1.id,
        knowledgeAreaId: kaFrontendArch.id,
        level: 3,
        vulnerabilityScore: 6,
        isOwner: false,
        lastUpdated: now,
      },
      {
        userId: user1.id,
        knowledgeAreaId: kaReactDesign.id,
        level: 4,
        vulnerabilityScore: 4,
        isOwner: false,
        lastUpdated: now,
      },
      {
        userId: user1.id,
        knowledgeAreaId: kaUnitTesting.id,
        level: 3,
        isOwner: false,
        lastUpdated: now,
      },
    ])

    // For Profile (User2 - Bob)
    await db.insert(userKnowledgeAreas).values([
      {
        userId: user2.id,
        knowledgeAreaId: kaBackendAPI.id,
        level: 4,
        vulnerabilityScore: 5,
        isOwner: false,
        lastUpdated: now,
      },
      {
        userId: user2.id,
        knowledgeAreaId: kaDbOptimization.id,
        level: 3,
        isOwner: false,
        lastUpdated: now,
      },
      {
        userId: user2.id,
        knowledgeAreaId: kaCICD.id,
        level: 2,
        vulnerabilityScore: 7,
        isOwner: false,
        lastUpdated: now,
      },
    ])
    
    console.log("User Knowledge Areas seeded.")

    // --- Create Career Milestones ---
    // For User1 (Alice)
    await db.insert(careerMilestones).values([
      {
        userId: user1.id,
        title: "Senior Developer Certification",
        description: "Achieved certification for senior frontend developer role.",
        status: "completed",
        date: new Date("2023-02-15T00:00:00Z"), // Ensure UTC or correct timezone
        plannedDate: null,
      },
      {
        userId: user1.id,
        title: "System Architecture Certification",
        description: "Plan to get certified in system architecture.",
        status: "planned",
        date: null,
        plannedDate: new Date("2024-08-20T00:00:00Z"),
      },
      {
        userId: user1.id,
        title: "Lead a Major Project",
        description: "Successfully led the 'Phoenix' project.",
        status: "achieved", // Assuming 'achieved' is a valid status
        date: new Date("2023-12-01T00:00:00Z"),
        plannedDate: null,
      },
    ])

    // For User2 (Bob)
    await db.insert(careerMilestones).values([
      {
        userId: user2.id,
        title: "Backend Specialization Course",
        status: "completed",
        date: new Date("2022-11-10T00:00:00Z"),
      },
      {
        userId: user2.id,
        title: "DevOps Professional Certification",
        status: "in_progress",
        plannedDate: new Date("2024-07-15T00:00:00Z"),
      },
    ])

    // For John Doe
     await db.insert(careerMilestones).values([
      {
        userId: johnDoe.id,
        title: "Frontend Tech Lead",
        status: "achieved",
        description: "Promoted to Frontend Tech Lead.",
        date: new Date("2024-01-10T00:00:00Z"),
      },
    ])

    console.log("Seed completed successfully!")
  } catch (error) {
    console.error("Error executing seed:", error)
  } finally {
    process.exit(0)
  }
}

seed()
