"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

export default function Game() {
  const [timer, setTimer] = useState(0);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<"win" | "lose" | null>(null);
  const [difference, setDifference] = useState<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const start = () => {
    if (running) return;
    setRunning(true);
    setResult(null);
    setDifference(null);
    startTimeRef.current = performance.now();
    intervalRef.current = setInterval(() => {
      const elapsed = performance.now() - startTimeRef.current;
      setTimer(elapsed / 1000);
    }, 10);
  };

  const stop = () => {
    if (!running) return;
    setRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    const elapsed = performance.now() - startTimeRef.current;
    const secs = elapsed / 1000;
    const diff = Math.abs(secs - 10);
    setDifference(diff);
    if (diff < 0.005) {
      setResult("win");
    } else {
      setResult("lose");
    }
  };

  const handleClick = () => {
    if (!running) {
      start();
    } else {
      stop();
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const bgClass =
    result === "win"
      ? "bg-green-500"
      : result === "lose"
      ? "bg-gray-800"
      : "bg-white";

  return (
    <div className={`flex flex-col items-center justify-center min-h-[200px] ${bgClass} p-4 rounded-lg`}>
      <div className="text-4xl font-mono mb-4">{timer.toFixed(2)}</div>
      <Button
        onClick={handleClick}
        className="bg-red-500 text-white rounded-full w-32 h-32 flex items-center justify-center text-2xl"
      >
        {running ? "Stop" : "Start"}
      </Button>
      {result && (
        <div className="mt-4 text-xl">
          {result === "win"
            ? "Victory! You hit 10.00 seconds."
            : `Failure! Difference: ${difference?.toFixed(2)} seconds.`}
        </div>
      )}
    </div>
  );
}
