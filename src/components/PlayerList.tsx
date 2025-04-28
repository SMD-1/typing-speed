"use client";

import {
  getColorForAccuracy,
  getColorForWPM,
  getPositionSuffix,
} from "@/lib/util/typing";
import { Trophy, User } from "lucide-react";
import { Progress } from "./ui/progress";
import { PlayerType } from "@/types";

interface PlayerListProps {
  readonly players: PlayerType[];
  readonly currentPlayerId: string;
}

export function PlayerList({ players, currentPlayerId }: PlayerListProps) {
  const uniquePlayers = players.filter(
    (player: PlayerType, index: number, self) =>
      index ===
      self.findIndex((p: PlayerType) => p.socketId === player.socketId)
  );
  // Sort players by progress descending
  const sortedPlayers = [...uniquePlayers]?.sort(
    (a: PlayerType, b: PlayerType) => b.progress - a.progress
  );

  return (
    <div className="rounded-lg border bg-card">
      <div className="px-4 py-3 border-b">
        <h3 className="font-semibold flex items-center">
          <Trophy className="h-4 w-4 mr-2 text-yellow-500" />
          Leaderboard
        </h3>
      </div>

      <div className="divide-y">
        {sortedPlayers.map((player, index) => {
          const isCurrentPlayer = player.socketId === currentPlayerId;

          return (
            <div
              key={player.socketId}
              className={`px-4 py-3 ${isCurrentPlayer ? "bg-muted/50" : ""}`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-secondary text-xs mr-2">
                    {index + 1}
                  </span>
                  <span
                    className={`font-medium ${
                      isCurrentPlayer ? "text-primary" : ""
                    }`}
                  >
                    {player.username}
                    {isCurrentPlayer && (
                      <span className="ml-1 text-xs text-muted-foreground">
                        (you)
                      </span>
                    )}
                  </span>
                </div>

                {player.completed && (
                  <span className="text-xs px-2 py-1 bg-green-500/10 text-green-500 rounded-full">
                    Finished {player.position}
                    {getPositionSuffix(player.position)}
                  </span>
                )}
              </div>

              <Progress value={player.progress} className="h-2 mb-2" />

              <div className="flex justify-between text-xs text-muted-foreground">
                <div>
                  Progress:{" "}
                  <span className="font-medium">{player.progress}%</span>
                </div>
                <div>
                  WPM:{" "}
                  <span className={`font-medium ${getColorForWPM(player.wpm)}`}>
                    {player.wpm}
                  </span>
                </div>
                <div>
                  Accuracy:{" "}
                  <span
                    className={`font-medium ${getColorForAccuracy(
                      player.accuracy
                    )}`}
                  >
                    {player.accuracy}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {sortedPlayers.length === 0 && (
          <div className="px-4 py-6 text-center text-muted-foreground">
            <User className="h-10 w-10 mx-auto mb-2 opacity-20" />
            <p>No players yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
