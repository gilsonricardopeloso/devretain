// backend/src/dashboard/dashboard.service.ts
import { Injectable } from "@nestjs/common";
import { db } from "../db";
import {
  users as usersTable,
  knowledgeAreas as knowledgeAreasTable,
  userKnowledgeAreas as userKnowledgeAreasTable,
} from "../db/schema";
import { eq, count, gt, sql } from "drizzle-orm";
import {
  AdminDashboardResponseDto,
  KnowledgeHeatMapItemDto,
  DashboardStatsDto,
} from "./dto/AdminDashboardResponse.dto";

@Injectable()
export class DashboardService {
  async getAdminDashboardData(): Promise<AdminDashboardResponseDto> {
    // 1. Knowledge Heat Map Data
    const heatMapResult = await db
      .select({
        id: userKnowledgeAreasTable.id,
        area: knowledgeAreasTable.name,
        level: userKnowledgeAreasTable.level,
        ownerName: usersTable.name,
        ownerEmail: usersTable.email,
        ownerId: usersTable.id,
        vulnerabilityScore: userKnowledgeAreasTable.vulnerabilityScore,
      })
      .from(userKnowledgeAreasTable)
      .innerJoin(
        usersTable,
        eq(userKnowledgeAreasTable.userId, usersTable.id)
      )
      .innerJoin(
        knowledgeAreasTable,
        eq(userKnowledgeAreasTable.knowledgeAreaId, knowledgeAreasTable.id)
      )
      .where(eq(userKnowledgeAreasTable.isOwner, true));

    const heatMapData: KnowledgeHeatMapItemDto[] = heatMapResult.map(
      (item) => ({
        id: item.id,
        area: item.area,
        level: item.level,
        ownerName: item.ownerName,
        ownerEmail: item.ownerEmail,
        ownerId: item.ownerId,
        vulnerabilityScore: item.vulnerabilityScore,
      })
    );

    // 2. Stats Data
    // Key Knowledge Areas
    const [keyKnowledgeAreasResult] = await db
      .select({ count: count(knowledgeAreasTable.id) })
      .from(knowledgeAreasTable);
    const keyKnowledgeAreas = keyKnowledgeAreasResult.count;

    // Vulnerability Alerts (e.g., score > 7)
    const VULNERABILITY_THRESHOLD = 7;
    const [vulnerabilityAlertsResult] = await db
      .select({ count: count() })
      .from(userKnowledgeAreasTable)
      .where(gt(userKnowledgeAreasTable.vulnerabilityScore, VULNERABILITY_THRESHOLD));
    const vulnerabilityAlerts = vulnerabilityAlertsResult.count;

    // Technical Documents (Placeholder)
    const technicalDocuments = 12; // TODO: Implementar contagem real de documentos técnicos quando modelado

    const stats: DashboardStatsDto = {
      keyKnowledgeAreas,
      vulnerabilityAlerts,
      technicalDocuments,
    };

    return {
      heatMapData,
      stats,
    };
  }
}
