export interface Participant {
  id: string;
  fullName: string;
  firstName?: string;
  lastName?: string;
  department?: string;
  employeeNumber?: string;
}

export interface ParseIssue {
  row: number;
  reason: string;
  raw?: Record<string, string>;
}

export interface DuplicateGroup {
  key: string;
  participants: Participant[];
}

export interface ParseResult {
  participants: Participant[];
  duplicateGroups: DuplicateGroup[];
  issues: ParseIssue[];
  totalRows: number;
  fileName: string;
}

export type ColumnKey =
  | "id"
  | "fullName"
  | "firstName"
  | "lastName"
  | "department"
  | "employeeNumber";
