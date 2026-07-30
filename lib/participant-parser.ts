import { readSheet } from "read-excel-file/browser";
import Papa from "papaparse";
import type { ColumnKey, ParseIssue, ParseResult, Participant } from "@/types/participant";
import { detectDuplicates } from "./duplicate-detector";
import { generateId, normalizeText } from "./utils";

const HEADER_ALIASES: Record<ColumnKey, string[]> = {
  id: ["id", "kimlik", "no"],
  fullName: [
    "ad soyad",
    "adsoyad",
    "isim",
    "name",
    "full name",
    "fullname",
    "calisan adi",
    "çalışan adı",
    "ad-soyad",
    "personel adi",
  ],
  firstName: ["ad", "isim adi", "first name", "firstname"],
  lastName: ["soyad", "soyisim", "last name", "lastname"],
  department: ["departman", "department", "birim", "bolum", "bölüm"],
  employeeNumber: [
    "sicil no",
    "sicilno",
    "sicil",
    "employee number",
    "employee no",
    "employeenumber",
    "personel no",
  ],
};

function matchColumn(header: string): ColumnKey | null {
  const normalized = normalizeText(header);
  for (const [key, aliases] of Object.entries(HEADER_ALIASES) as [ColumnKey, string[]][]) {
    if (aliases.some((alias) => normalizeText(alias) === normalized)) {
      return key;
    }
  }
  return null;
}

function buildColumnMap(headerRow: string[]): Map<number, ColumnKey> {
  const map = new Map<number, ColumnKey>();
  headerRow.forEach((header, index) => {
    const key = matchColumn(String(header ?? ""));
    if (key) {
      map.set(index, key);
    }
  });
  return map;
}

function splitFullName(fullName: string): { firstName?: string; lastName?: string } {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length < 2) {
    return { firstName: parts[0] };
  }
  const lastName = parts[parts.length - 1];
  const firstName = parts.slice(0, -1).join(" ");
  return { firstName, lastName };
}

interface RawRecord {
  values: Record<ColumnKey, string>;
  rowNumber: number;
}

function rowsToParticipants(rows: RawRecord[]): { participants: Participant[]; issues: ParseIssue[] } {
  const participants: Participant[] = [];
  const issues: ParseIssue[] = [];

  for (const row of rows) {
    const { values, rowNumber } = row;
    const explicitFullName = values.fullName?.trim();
    const composedFullName = [values.firstName, values.lastName]
      .filter((part) => part && part.trim().length > 0)
      .join(" ")
      .trim();

    const fullName = explicitFullName || composedFullName;

    if (!fullName) {
      issues.push({
        row: rowNumber,
        reason: "Ad veya ad soyad bilgisi boş olduğu için satır listeye alınmadı.",
        raw: values,
      });
      continue;
    }

    const { firstName, lastName } = explicitFullName
      ? splitFullName(explicitFullName)
      : { firstName: values.firstName, lastName: values.lastName };

    participants.push({
      id: values.id?.trim() || generateId("katilimci"),
      fullName,
      firstName: firstName?.trim() || undefined,
      lastName: lastName?.trim() || undefined,
      department: values.department?.trim() || undefined,
      employeeNumber: values.employeeNumber?.trim() || undefined,
    });
  }

  return { participants, issues };
}

function toRawRecords(headerRow: string[], dataRows: unknown[][]): RawRecord[] {
  const columnMap = buildColumnMap(headerRow);

  return dataRows.map((row, dataIndex) => {
    const values: Partial<Record<ColumnKey, string>> = {};
    columnMap.forEach((key, colIndex) => {
      const cell = row[colIndex];
      values[key] = cell === null || cell === undefined ? "" : String(cell).trim();
    });
    return {
      values: values as Record<ColumnKey, string>,
      rowNumber: dataIndex + 2, // 1. satir basliktir
    };
  });
}

async function parseExcelFile(file: File): Promise<{ headerRow: string[]; dataRows: unknown[][] }> {
  const rows = await readSheet(file);
  const [headerRow, ...dataRows] = rows;
  if (!headerRow) {
    throw new Error("Dosyada başlık satırı bulunamadı.");
  }
  return { headerRow: headerRow.map((cell) => String(cell ?? "")), dataRows };
}

function parseCsvFile(file: File): Promise<{ headerRow: string[]; dataRows: unknown[][] }> {
  return new Promise((resolve, reject) => {
    Papa.parse<string[]>(file, {
      skipEmptyLines: true,
      complete: (result) => {
        const rows = result.data;
        const [headerRow, ...dataRows] = rows;
        if (!headerRow) {
          reject(new Error("Dosyada başlık satırı bulunamadı."));
          return;
        }
        resolve({ headerRow, dataRows });
      },
      error: (error: Error) => reject(error),
    });
  });
}

export class ParticipantFileError extends Error {}

export async function parseParticipantFile(file: File): Promise<ParseResult> {
  const extension = file.name.split(".").pop()?.toLowerCase();

  if (!extension || !["xlsx", "xls", "csv"].includes(extension)) {
    throw new ParticipantFileError(
      "Desteklenmeyen dosya türü. Lütfen .xlsx, .xls veya .csv dosyası yükleyin."
    );
  }

  let parsed: { headerRow: string[]; dataRows: unknown[][] };
  try {
    parsed = extension === "csv" ? await parseCsvFile(file) : await parseExcelFile(file);
  } catch (error) {
    throw new ParticipantFileError(
      `Dosya okunurken bir hata oluştu: ${error instanceof Error ? error.message : "bilinmeyen hata"}`
    );
  }

  const columnMap = buildColumnMap(parsed.headerRow);
  const hasNameColumn = Array.from(columnMap.values()).some(
    (key) => key === "fullName" || key === "firstName"
  );

  if (!hasNameColumn) {
    throw new ParticipantFileError(
      "Dosyada ad veya ad soyad kolonu bulunamadı. Lütfen kolon başlıklarını kontrol edin."
    );
  }

  const rawRecords = toRawRecords(parsed.headerRow, parsed.dataRows);
  const { participants: parsedParticipants, issues } = rowsToParticipants(rawRecords);
  const { unique, duplicateGroups } = detectDuplicates(parsedParticipants);

  return {
    participants: unique,
    duplicateGroups,
    issues,
    totalRows: parsed.dataRows.length,
    fileName: file.name,
  };
}
