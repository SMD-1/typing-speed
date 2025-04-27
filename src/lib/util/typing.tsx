import React from "react";

export function formatTime(milliseconds: number): string {
  if (!milliseconds) return "0:00";

  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function formatCountdown(seconds: number): string {
  if (seconds <= 0) return "GO!";
  return seconds.toString();
}

export function getColorForAccuracy(accuracy: number): string {
  if (accuracy >= 95) return "text-green-500";
  if (accuracy >= 85) return "text-yellow-500";
  return "text-red-500";
}

export function getColorForWPM(wpm: number): string {
  if (wpm >= 80) return "text-green-500";
  if (wpm >= 50) return "text-yellow-500";
  if (wpm >= 30) return "text-blue-500";
  return "text-gray-500";
}

export function getPositionSuffix(position: number): string {
  if (position === 1) return "st";
  if (position === 2) return "nd";
  if (position === 3) return "rd";
  return "th";
}

export function highlightText(
  text: string,
  currentPosition: number
): React.ReactElement {
  const beforeCursor = text.substring(0, currentPosition);
  const currentChar = text.charAt(currentPosition);
  const afterCursor = text.substring(currentPosition + 1);

  return (
    <React.Fragment>
      <span className="text-green-500">{beforeCursor}</span>
      <span className="bg-primary text-primary-foreground animate-pulse">
        {currentChar}
      </span>
      <span className="text-muted-foreground">{afterCursor}</span>
    </React.Fragment>
  );
}
