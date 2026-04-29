"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";

type FrameCtx = { frame: number; fps: number };
const Ctx = createContext<FrameCtx>({ frame: 0, fps: 30 });

export function useFrame() {
  return useContext(Ctx).frame;
}

export function useFps() {
  return useContext(Ctx).fps;
}

// Drives frames at fps via rAF. Resets to 0 when `playKey` changes.
// Stops once it hits durationInFrames so animations don't loop weirdly.
export function FrameProvider({
  children,
  fps = 30,
  durationInFrames = 240,
  playKey,
}: {
  children: React.ReactNode;
  fps?: number;
  durationInFrames?: number;
  playKey: string | number;
}) {
  const [frame, setFrame] = useState(0);
  const startedAt = useRef<number | null>(null);
  const lastKey = useRef(playKey);

  useEffect(() => {
    let raf = 0;
    startedAt.current = null;
    // Reset to frame 0 when slide/theme changes — this is the entry point
    // for a new animation cycle, not a cascading effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFrame(0);
    lastKey.current = playKey;

    const tick = (t: number) => {
      if (startedAt.current === null) startedAt.current = t;
      const elapsedMs = t - startedAt.current;
      const f = Math.min(durationInFrames, Math.floor((elapsedMs / 1000) * fps));
      setFrame(f);
      if (f < durationInFrames) {
        raf = requestAnimationFrame(tick);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playKey, fps, durationInFrames]);

  return <Ctx.Provider value={{ frame, fps }}>{children}</Ctx.Provider>;
}
