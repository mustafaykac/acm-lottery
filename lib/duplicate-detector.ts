import type { DuplicateGroup, Participant } from "@/types/participant";
import { normalizeText } from "./utils";

function duplicateKey(participant: Participant): string {
  const namePart = normalizeText(participant.fullName);
  const employeeNumberPart = participant.employeeNumber
    ? normalizeText(participant.employeeNumber)
    : "";
  return employeeNumberPart ? `sicil:${employeeNumberPart}` : `ad:${namePart}`;
}

export interface DuplicateDetectionResult {
  unique: Participant[];
  duplicateGroups: DuplicateGroup[];
}

/**
 * Aynı sicil numarasına veya (sicil yoksa) aynı ad soyada sahip kayıtları tespit eder.
 * Her grubun ilk kaydı benzersiz listeye alınır, diğerleri "tekrarlı" olarak raporlanır
 * ve kura havuzuna dahil edilmez.
 */
export function detectDuplicates(participants: Participant[]): DuplicateDetectionResult {
  const groups = new Map<string, Participant[]>();

  for (const participant of participants) {
    const key = duplicateKey(participant);
    const existing = groups.get(key);
    if (existing) {
      existing.push(participant);
    } else {
      groups.set(key, [participant]);
    }
  }

  const unique: Participant[] = [];
  const duplicateGroups: DuplicateGroup[] = [];

  for (const [key, group] of groups) {
    const first = group[0];
    if (!first) continue;
    unique.push(first);
    if (group.length > 1) {
      duplicateGroups.push({ key, participants: group });
    }
  }

  return { unique, duplicateGroups };
}
