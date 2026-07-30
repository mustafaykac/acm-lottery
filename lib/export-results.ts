import type { DrawAuditRecord, DrawSession, Winner } from "@/types/draw";
import { formatDateTime } from "./utils";

function triggerDownload(content: string, mimeType: string, fileName: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

function escapeCsvValue(value: string): string {
  if (/[",\n;]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function exportWinnersAsCsv(winners: Winner[]): void {
  const header = ["Sıra", "Ad Soyad", "Departman", "Sicil No", "Seçildiği Zaman"];
  const rows = winners.map((winner) => [
    String(winner.drawNumber),
    winner.participant.fullName,
    winner.participant.department ?? "",
    winner.participant.employeeNumber ?? "",
    formatDateTime(winner.selectedAt),
  ]);

  const csvContent = [header, ...rows]
    .map((row) => row.map(escapeCsvValue).join(";"))
    .join("\n");

  triggerDownload(`﻿${csvContent}`, "text/csv;charset=utf-8", "hull-city-kura-sonuclari.csv");
}

export function exportWinnersAsJson(
  winners: Winner[],
  auditLog: DrawAuditRecord[],
  session: DrawSession | null
): void {
  const payload = {
    session,
    winners,
    auditLog,
    exportedAt: new Date().toISOString(),
  };

  triggerDownload(
    JSON.stringify(payload, null, 2),
    "application/json;charset=utf-8",
    "hull-city-kura-sonuclari.json"
  );
}
