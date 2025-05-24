// backend/src/dashboard/dto/AdminDashboardResponse.dto.ts
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";

export class KnowledgeHeatMapItemDto {
  @ApiProperty({ description: "ID of the UserKnowledgeArea entry" })
  id: number; // This will be userKnowledgeAreas.id

  @ApiProperty({ description: "Name of the knowledge area" })
  area: string;

  @ApiProperty({ description: "Proficiency level in the knowledge area" })
  level: number;

  @ApiProperty({ description: "Name of the owner of this knowledge area" })
  ownerName: string;

  @ApiProperty({ description: "Email of the owner" })
  ownerEmail: string;
  
  @ApiProperty({ description: "ID of the owner (user ID)" })
  ownerId: number;

  @ApiProperty({
    description: "Vulnerability score associated with this knowledge area",
    nullable: true,
  })
  vulnerabilityScore?: number | null;
}

export class DashboardStatsDto {
  @ApiProperty({ description: "Total number of key knowledge areas defined" })
  keyKnowledgeAreas: number;

  @ApiProperty({ description: "Number of knowledge areas with high vulnerability scores" })
  vulnerabilityAlerts: number;

  @ApiProperty({ description: "Total number of technical documents (placeholder)" })
  technicalDocuments: number;
}

export class AdminDashboardResponseDto {
  @ApiProperty({ type: [KnowledgeHeatMapItemDto] })
  @ValidateNested({ each: true })
  @Type(() => KnowledgeHeatMapItemDto)
  heatMapData: KnowledgeHeatMapItemDto[];

  @ApiProperty({ type: DashboardStatsDto })
  @ValidateNested()
  @Type(() => DashboardStatsDto)
  stats: DashboardStatsDto;
}
