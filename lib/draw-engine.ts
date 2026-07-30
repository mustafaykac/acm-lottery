import type { Participant } from "@/types/participant";
import type { DrawAuditRecord, Winner } from "@/types/draw";
import { secureRandomPick } from "./secure-random";

export interface DrawOutcome {
  winner: Winner;
  auditRecord: DrawAuditRecord;
  remainingPool: Participant[];
}

/**
 * Kalan aday havuzundan güvenli rastgele bir kazanan seçer.
 * Seçilen kişi havuzdan çıkarılır ve tekrar seçilemez.
 */
export function drawNextWinner(
  pool: readonly Participant[],
  drawNumber: number
): DrawOutcome {
  if (pool.length === 0) {
    throw new Error("Kura havuzunda aday kalmadı.");
  }

  const participantCountBeforeDraw = pool.length;
  const { picked, rest } = secureRandomPick(pool);
  const selectedAt = new Date().toISOString();

  const winner: Winner = {
    drawNumber,
    participant: picked,
    selectedAt,
  };

  const auditRecord: DrawAuditRecord = {
    drawNumber,
    winnerId: picked.id,
    winnerName: picked.fullName,
    department: picked.department,
    employeeNumber: picked.employeeNumber,
    selectedAt,
    participantCountBeforeDraw,
    participantCountAfterDraw: rest.length,
  };

  return { winner, auditRecord, remainingPool: rest };
}
