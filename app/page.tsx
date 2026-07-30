"use client";

import { useEffect, useState } from "react";
import { useDrawStore } from "@/store/draw-store";
import WelcomeScreen from "@/components/WelcomeScreen";
import FileUploader from "@/components/FileUploader";
import ParticipantPreview from "@/components/ParticipantPreview";
import DrawStage from "@/components/DrawStage";

export default function HomePage() {
  const [hasHydrated, setHasHydrated] = useState(false);
  const phase = useDrawStore((state) => state.phase);

  useEffect(() => {
    const result = useDrawStore.persist.rehydrate();
    if (result instanceof Promise) {
      result.finally(() => setHasHydrated(true));
    } else {
      setHasHydrated(true);
    }
  }, []);

  if (!hasHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-white/40">
        Yükleniyor...
      </div>
    );
  }

  switch (phase) {
    case "WELCOME":
      return <WelcomeScreen />;
    case "UPLOAD":
      return <FileUploader />;
    case "PREVIEW":
      return <ParticipantPreview />;
    case "DRAW":
    case "COMPLETED":
      return <DrawStage />;
    default:
      return <WelcomeScreen />;
  }
}
