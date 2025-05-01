"use client";

import { formatCountdown } from "@/lib/util/typing";
import { useState, useEffect } from "react";

interface CountdownTimerProps {
  readonly duration: number;
}

export function CountdownTimer({ duration }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh]">
      <div className="text-7xl sm:text-9xl font-bold mb-4 animate-pulse">
        {formatCountdown(timeLeft)}
      </div>
      <p className="text-xl text-muted-foreground">
        {timeLeft <= 0 ? "Race has begun!" : "Get ready to type!"}
      </p>
    </div>
  );
}
