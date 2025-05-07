"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Activity, CheckCircle2, Timer, Percent } from "lucide-react";
import { useTypingGame } from "@/lib/hooks/useTypingGame";
import {
  getColorForAccuracy,
  getColorForWPM,
  highlightText,
} from "@/lib/util/typing";

interface TypingInterfaceProps {
  readonly text: string;
  readonly gameStarted: boolean;
  readonly onProgress: (
    progress: number,
    wpm: number,
    accuracy: number
  ) => void;
}

export function TypingInterface({
  text,
  gameStarted,
  onProgress,
}: TypingInterfaceProps) {
  const { userInput, stats, handleTyping } = useTypingGame({
    text,
    gameStarted,
    onProgress,
  });

  return (
    <div className="space-y-6">
      <Card className="border-2 border-border/50 shadow-md overflow-hidden">
        <div className="p-4 bg-muted/30 border-b flex items-center justify-between">
          <div className="flex space-x-4">
            <div className="flex items-center">
              <Activity
                className={`h-5 w-5 mr-2 ${getColorForWPM(stats.wpm)}`}
              />
              <span className="text-sm font-medium">WPM: </span>
              <span className={`ml-1 font-bold ${getColorForWPM(stats.wpm)}`}>
                {stats.wpm}
              </span>
            </div>

            <div className="flex items-center">
              <CheckCircle2
                className={`h-5 w-5 mr-2 ${getColorForAccuracy(
                  stats.accuracy
                )}`}
              />
              <span className="text-sm font-medium">Accuracy: </span>
              <span
                className={`ml-1 font-bold ${getColorForAccuracy(
                  stats.accuracy
                )}`}
              >
                {stats.accuracy}%
              </span>
            </div>
          </div>

          <div className="flex items-center">
            <Progress value={stats.progress} className="w-24 h-2 mr-2" />
            <span className="text-sm font-medium">{stats.progress}%</span>
          </div>
        </div>

        <CardContent className="p-6">
          <div className="rounded-lg bg-card p-4 mb-6 text-lg leading-relaxed min-h-24 font-mono border">
            {gameStarted ? (
              highlightText(text, stats.currentIndex)
            ) : (
              <span className="text-muted-foreground">{text}</span>
            )}
          </div>

          <div className="relative">
            <input
              type="text"
              value={userInput}
              onChange={handleTyping}
              disabled={!gameStarted || stats.complete}
              className={`w-full p-4 rounded-lg border-2 bg-background focus:ring-2 focus:ring-primary/20 font-mono text-lg
                ${!gameStarted ? "cursor-not-allowed bg-muted/50" : ""}
                ${
                  stats.complete
                    ? "border-green-500 bg-green-500/5"
                    : "border-border"
                }`}
              placeholder={
                gameStarted ? "Start typing..." : "Waiting for game to start..."
              }
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
            />

            {stats.complete && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-lg">
                <div className="text-center">
                  <CheckCircle2 className="h-10 w-10 text-green-500 mx-auto mb-2" />
                  <p className="text-xl font-bold">Completed!</p>
                  <p className="text-muted-foreground">
                    Waiting for other players...
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card shadow-sm">
          <CardContent className="p-4 flex items-center">
            <Activity className="h-10 w-10 text-chart-1 mr-4" />
            <div>
              <p className="text-sm text-muted-foreground">Speed</p>
              <p className="text-2xl font-bold">
                {stats.wpm}
                <span className="text-sm text-muted-foreground ml-1">WPM</span>
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card shadow-sm">
          <CardContent className="p-4 flex items-center">
            <Percent className="h-10 w-10 text-chart-2 mr-4" />
            <div>
              <p className="text-sm text-muted-foreground">Accuracy</p>
              <p className="text-2xl font-bold">
                {stats.accuracy}
                <span className="text-sm text-muted-foreground ml-1">%</span>
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card shadow-sm">
          <CardContent className="p-4 flex items-center">
            <Timer className="h-10 w-10 text-chart-3 mr-4" />
            <div>
              <p className="text-sm text-muted-foreground">Characters</p>
              <p className="text-2xl font-bold">
                {stats.correctKeystrokes}
                <span className="text-sm text-muted-foreground ml-1">
                  /{text?.length}
                </span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
