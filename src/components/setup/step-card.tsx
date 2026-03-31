"use client";

import { useEffect, useRef, useState } from "react";
import { Clock } from "lucide-react";

interface StepCardProps {
  stepNumber: number;
  title: string;
  id: string;
  time?: string;
  children: React.ReactNode;
}

export function StepCard({ stepNumber, title, id, time, children }: StepCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0, rootMargin: "200px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={cardRef}
      id={id}
      data-step={stepNumber}
      className={`transition-all duration-700 ease-out rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-md p-6 sm:p-8 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      <div className="mb-5 flex items-center gap-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-orange-500 text-sm font-bold text-white">
          {stepNumber}
        </span>
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
        </div>
        {time && (
          <span className="flex items-center gap-1 text-[11px] text-white/30">
            <Clock className="h-3 w-3" />
            {time}
          </span>
        )}
      </div>
      <div className="space-y-4 text-sm leading-relaxed text-white/70">
        {children}
      </div>
    </section>
  );
}
