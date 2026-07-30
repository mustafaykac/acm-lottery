import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Participant, ParseResult } from "@/types/participant";
import type {
  AppPhase,
  DrawAuditRecord,
  DrawSession,
  DrawSettings,
  Winner,
} from "@/types/draw";
import {
  DEFAULT_ANIMATION_DURATION_MS,
  DEFAULT_TOTAL_WINNERS,
  MAX_TOTAL_WINNERS,
  MIN_TOTAL_WINNERS,
} from "@/types/draw";
import { drawNextWinner } from "@/lib/draw-engine";
import { generateId } from "@/lib/utils";

interface DrawStoreState {
  phase: AppPhase;
  allParticipants: Participant[];
  remainingPool: Participant[];
  winners: Winner[];
  auditLog: DrawAuditRecord[];
  session: DrawSession | null;
  settings: DrawSettings;
  pendingParseResult: ParseResult | null;
  isDrawing: boolean;

  setPendingParseResult: (result: ParseResult | null) => void;
  goToUpload: () => void;
  confirmParticipants: () => void;
  runDraw: () => Winner;
  finishReveal: () => void;
  updateSettings: (partial: Partial<DrawSettings>) => void;
  updateTotalWinners: (count: number) => void;
  resetAll: () => void;
}

const initialSettings: DrawSettings = {
  soundEnabled: true,
  animationDurationMs: DEFAULT_ANIMATION_DURATION_MS,
  totalWinners: DEFAULT_TOTAL_WINNERS,
};

export const useDrawStore = create<DrawStoreState>()(
  persist(
    (set, get) => ({
      phase: "WELCOME",
      allParticipants: [],
      remainingPool: [],
      winners: [],
      auditLog: [],
      session: null,
      settings: initialSettings,
      pendingParseResult: null,
      isDrawing: false,

      setPendingParseResult: (result) => {
        set({ pendingParseResult: result, phase: result ? "PREVIEW" : "UPLOAD" });
      },

      goToUpload: () => {
        set({ phase: "UPLOAD", pendingParseResult: null });
      },

      confirmParticipants: () => {
        const { pendingParseResult, settings } = get();
        if (!pendingParseResult || pendingParseResult.participants.length === 0) return;

        const requestedTotalWinners = Math.min(
          Math.max(settings.totalWinners, MIN_TOTAL_WINNERS),
          pendingParseResult.participants.length
        );

        const session: DrawSession = {
          sessionId: generateId("oturum"),
          createdAt: new Date().toISOString(),
          totalParticipants: pendingParseResult.participants.length,
          totalWinners: requestedTotalWinners,
          status: "READY",
        };

        set({
          allParticipants: pendingParseResult.participants,
          remainingPool: pendingParseResult.participants,
          winners: [],
          auditLog: [],
          session,
          settings: { ...settings, totalWinners: requestedTotalWinners },
          pendingParseResult: null,
          phase: "DRAW",
        });
      },

      // NOT: Gerçek kazanan bu fonksiyon çağrıldığı anda güvenli rastgele
      // seçim ile belirlenir ve derhal kaydedilir. Ekrandaki dönme animasyonu
      // sadece görseldir; sonucu değiştirmez. Kazanan, animasyon bittiğinde
      // finishReveal() çağrılana kadar arayüzde açıkça gösterilmez.
      runDraw: () => {
        const { isDrawing, remainingPool, winners, auditLog, session, settings } = get();
        const targetTotalWinners = session?.totalWinners ?? settings.totalWinners;
        if (isDrawing) {
          throw new Error("Kura zaten devam ediyor.");
        }
        if (winners.length >= targetTotalWinners) {
          throw new Error("Kura zaten tamamlandı.");
        }
        if (remainingPool.length === 0) {
          throw new Error("Kura havuzunda aday kalmadı.");
        }

        const drawNumber = winners.length + 1;
        const outcome = drawNextWinner(remainingPool, drawNumber);
        const nextWinners = [...winners, outcome.winner];

        const nextSession: DrawSession | null = session
          ? { ...session, status: "RUNNING" }
          : session;

        set({
          remainingPool: outcome.remainingPool,
          winners: nextWinners,
          auditLog: [...auditLog, outcome.auditRecord],
          session: nextSession,
          isDrawing: true,
        });

        return outcome.winner;
      },

      finishReveal: () => {
        const { winners, session, settings } = get();
        const targetTotalWinners = session?.totalWinners ?? settings.totalWinners;
        const isComplete = winners.length >= targetTotalWinners;
        set({
          isDrawing: false,
          phase: isComplete ? "COMPLETED" : "DRAW",
          session:
            session && isComplete
              ? { ...session, status: "COMPLETED", completedAt: new Date().toISOString() }
              : session,
        });
      },

      updateSettings: (partial) => {
        set((state) => ({ settings: { ...state.settings, ...partial } }));
      },

      // Kura basladiktan (ilk kazanan secildikten) sonra hedef kazanan sayisi
      // degistirilemez; bu durumda cagri sessizce yok sayilir.
      updateTotalWinners: (count) => {
        const { winners, allParticipants, session } = get();
        if (winners.length > 0 || !Number.isFinite(count)) return;

        const upperBound = Math.max(
          MIN_TOTAL_WINNERS,
          Math.min(MAX_TOTAL_WINNERS, allParticipants.length || MAX_TOTAL_WINNERS)
        );
        const clamped = Math.min(Math.max(Math.trunc(count), MIN_TOTAL_WINNERS), upperBound);

        set((state) => ({
          settings: { ...state.settings, totalWinners: clamped },
          session: session ? { ...session, totalWinners: clamped } : session,
        }));
      },

      resetAll: () => {
        set({
          phase: "WELCOME",
          allParticipants: [],
          remainingPool: [],
          winners: [],
          auditLog: [],
          session: null,
          pendingParseResult: null,
          isDrawing: false,
        });
      },
    }),
    {
      name: "hull-city-kura:draw-state-v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        phase: state.phase,
        allParticipants: state.allParticipants,
        remainingPool: state.remainingPool,
        winners: state.winners,
        auditLog: state.auditLog,
        session: state.session,
        settings: state.settings,
      }),
      skipHydration: true,
    }
  )
);
