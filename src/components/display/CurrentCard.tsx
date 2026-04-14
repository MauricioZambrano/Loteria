"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/lib/cards";

interface CurrentCardProps {
  card: Card | null;
}

export function CurrentCard({ card }: CurrentCardProps) {
  // Track previous card ID so we can animate on change
  const [displayCard, setDisplayCard] = useState<Card | null>(card);
  const [animating, setAnimating] = useState(false);
  const prevIdRef = useRef<number | null>(card?.id ?? null);

  useEffect(() => {
    if (card?.id === prevIdRef.current) return;
    prevIdRef.current = card?.id ?? null;

    setAnimating(true);
    const t = setTimeout(() => {
      setDisplayCard(card);
      setAnimating(false);
    }, 150);
    return () => clearTimeout(t);
  }, [card]);

  if (!displayCard) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 h-full">
        <div className="w-56 h-80 rounded-2xl border-2 border-dashed border-zinc-700 flex items-center justify-center">
          <p className="text-zinc-600 text-xl text-center px-4">
            Esperando primera carta...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={[
        "flex flex-col items-center justify-center gap-3 transition-all duration-150",
        animating ? "opacity-0 scale-95" : "opacity-100 scale-100",
      ].join(" ")}
    >
      {/* Card */}
      <div className="relative w-56 h-80 sm:w-64 sm:h-96 md:w-72 md:h-[420px] lg:w-80 lg:h-[480px] rounded-2xl border-4 border-yellow-400 bg-zinc-900 flex flex-col overflow-hidden shadow-2xl shadow-yellow-400/20">
        {/* Decorative top band */}
        <div className="bg-yellow-400 py-1.5 text-center">
          <span className="text-zinc-900 font-black text-sm tracking-widest uppercase">
            Lotería
          </span>
        </div>

        {/* Card number + name */}
        <div className="flex-1 flex flex-col items-center justify-center gap-2 p-4">
          <span className="text-zinc-500 text-sm font-mono">#{displayCard.id}</span>
          <span className="text-white font-black text-3xl sm:text-4xl text-center leading-tight">
            {displayCard.name}
          </span>
        </div>

        {/* Decorative bottom band */}
        <div className="bg-yellow-400 py-1.5 text-center">
          <span className="text-zinc-900 font-black text-sm tracking-widest uppercase">
            ¡Buena suerte!
          </span>
        </div>
      </div>
    </div>
  );
}
