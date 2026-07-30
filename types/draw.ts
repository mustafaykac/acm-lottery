import type { Participant } from "./participant";

export type DrawSessionStatus = "READY" | "RUNNING" | "COMPLETED";

export type AppPhase =
  | "WELCOME"
  | "UPLOAD"
  | "PREVIEW"
  | "DRAW"
  | "COMPLETED";

export interface Winner {
  drawNumber: number;
  participant: Participant;
  selectedAt: string;
}

export interface DrawAuditRecord {
  drawNumber: number;
  winnerId: string;
  winnerName: string;
  department?: string;
  employeeNumber?: string;
  selectedAt: string;
  participantCountBeforeDraw: number;
  participantCountAfterDraw: number;
}

export interface DrawSession {
  sessionId: string;
  createdAt: string;
  completedAt?: string;
  totalParticipants: number;
  totalWinners: number;
  status: DrawSessionStatus;
}

export interface DrawSettings {
  soundEnabled: boolean;
  animationDurationMs: number;
  totalWinners: number;
}

export const DEFAULT_TOTAL_WINNERS = 5;
export const MIN_TOTAL_WINNERS = 1;
export const MAX_TOTAL_WINNERS = 50;

export const MIN_ANIMATION_DURATION_MS = 5000;
export const MAX_ANIMATION_DURATION_MS = 8000;
export const DEFAULT_ANIMATION_DURATION_MS = 6500;
