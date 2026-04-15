"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Card, getCardImagePath } from "@/lib/cards";

interface CurrentCardProps {
  card: Card | null;
}

export function CurrentCard({ card }: CurrentCardProps) {
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
        "flex flex-col items-center justify-center transition-all duration-150",
        animating ? "opacity-0 scale-95" : "opacity-100 scale-100",
      ].join(" ")}
    >
      <div className="relative w-56 h-80 sm:w-64 sm:h-96 md:w-72 md:h-[420px] lg:w-80 lg:h-[480px] rounded-2xl border-4 border-yellow-400 overflow-hidden shadow-2xl shadow-yellow-400/20">
        <Image
          src={getCardImagePath(displayCard)}
          alt={displayCard.name}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 640px) 224px, (max-width: 768px) 256px, (max-width: 1024px) 288px, 320px"
        />
        {/* Name overlay at bottom */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent pt-6 pb-2 px-2 text-center">
          <p className="text-white font-black text-xl sm:text-2xl leading-tight drop-shadow">
            {displayCard.name}
          </p>
        </div>
      </div>
    </div>
  );
}
