"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getSocket } from "@/lib/socket";
import {
  Trophy,
  Medal,
  BarChart3,
  Clock,
  Rotate3D as Rotate,
  Home,
} from "lucide-react";
import {
  formatTime,
  getColorForAccuracy,
  getColorForWPM,
  getPositionSuffix,
} from "@/lib/util/typing";
import { PlayerType } from "@/types";

interface GameResultsProps {
  readonly players: PlayerType[];
  readonly passage: string;
}

export function GameResults({ players, passage }: GameResultsProps) {
  const [tab, setTab] = useState("results");
  const router = useRouter();
  const currentPlayerId = getSocket().id;

  // Sort players by position
  const sortedPlayers = [...players].sort((a, b) => a.position - b.position);

  // Find current player
  const currentPlayer = players.find(
    (p: PlayerType) => p.socketId === currentPlayerId
  );

  // Get top 3 players
  const topPlayers = sortedPlayers.slice(0, 3);

  // Calculate elapsed time for each player
  const fastestTime = topPlayers[0]?.finishTime || 0;

  const handleNewGame = () => {
    router.push("/multi-player");
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Race Complete!</h2>
        <p className="text-muted-foreground">
          The race has ended. Check out the results below.
        </p>
      </div>

      {/* Podium for top 3 players */}
      <div className="flex justify-center items-end h-64 mb-12">
        {topPlayers.map((player: PlayerType, index: number) => {
          // Determine podium position
          const position = index + 1;
          const height =
            position === 1 ? "h-full" : position === 2 ? "h-4/5" : "h-3/5";
          const medalColor =
            position === 1
              ? "text-yellow-500"
              : position === 2
              ? "text-gray-400"
              : "text-amber-700";

          return (
            <div
              key={player.socketId}
              className={`flex flex-col items-center ${
                position === 1
                  ? "order-2 mx-4"
                  : position === 2
                  ? "order-1"
                  : "order-3"
              }`}
            >
              <div className="mb-2">
                <div className="relative">
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
                    {position === 1 ? (
                      <Trophy className={`h-8 w-8 ${medalColor}`} />
                    ) : (
                      <Medal className={`h-7 w-7 ${medalColor}`} />
                    )}
                  </div>
                  <div
                    className={`w-24 h-24 rounded-full bg-muted flex items-center justify-center border-2 ${
                      player.socketId === currentPlayerId
                        ? "border-primary"
                        : "border-muted"
                    }`}
                  >
                    <span className="text-lg font-bold">{player.username}</span>
                  </div>
                </div>
                <div className="text-center mt-2">
                  <p className={`font-bold ${getColorForWPM(player.wpm)}`}>
                    {player.wpm} WPM
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {player.accuracy}% accuracy
                  </p>
                </div>
              </div>
              <div
                className={`${height} w-24 rounded-t-lg bg-muted flex items-end justify-center relative overflow-hidden`}
              >
                <div
                  className={`absolute bottom-0 w-full ${
                    position === 1
                      ? "bg-yellow-500/20"
                      : position === 2
                      ? "bg-gray-400/20"
                      : "bg-amber-700/20"
                  } h-full`}
                ></div>
                <span className="relative text-lg font-bold mb-2">
                  {position}
                  {getPositionSuffix(position)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <Tabs
        defaultValue="results"
        value={tab}
        onValueChange={setTab}
        className="mb-8"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="results">
            <Trophy className="h-4 w-4 mr-2" />
            Results
          </TabsTrigger>
          <TabsTrigger value="stats">
            <BarChart3 className="h-4 w-4 mr-2" />
            Detailed Stats
          </TabsTrigger>
        </TabsList>

        <TabsContent value="results" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Race Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y">
                {sortedPlayers.map((player, index) => {
                  const timeDifference = player.finishTime
                    ? player.finishTime - fastestTime
                    : 0;

                  return (
                    <div
                      key={player.socketId}
                      className={`py-3 flex items-center ${
                        player.socketId === currentPlayerId
                          ? "bg-muted/50 rounded"
                          : ""
                      }`}
                    >
                      <div className="w-8 text-center font-bold">
                        {player.position}
                      </div>
                      <div className="flex-grow ml-2">
                        <div className="font-medium">
                          {player.username}
                          {player.socketId === currentPlayerId && (
                            <span className="ml-1 text-xs text-muted-foreground">
                              (you)
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {player.completed ? "Finished" : "Did not finish"}
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`font-bold ${getColorForWPM(player.wpm)}`}
                        >
                          {player.wpm} WPM
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center justify-end">
                          <Clock className="h-3 w-3 mr-1" />
                          {index === 0 ? (
                            formatTime(
                              player.finishTime
                                ? player.finishTime - fastestTime
                                : 0
                            )
                          ) : (
                            <>+{formatTime(timeDifference)}</>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Detailed Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {sortedPlayers.map((player) => (
                  <Card
                    key={player.socketId}
                    className={
                      player.socketId === currentPlayerId
                        ? "border-primary"
                        : ""
                    }
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold">{player.username}</h3>
                        <span className="text-xs px-2 py-1 rounded-full bg-muted">
                          #{player.position}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            Speed:
                          </span>
                          <span
                            className={`font-bold ${getColorForWPM(
                              player.wpm
                            )}`}
                          >
                            {player.wpm} WPM
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            Accuracy:
                          </span>
                          <span
                            className={`font-bold ${getColorForAccuracy(
                              player.accuracy
                            )}`}
                          >
                            {player.accuracy}%
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            Progress:
                          </span>
                          <span className="font-bold">{player.progress}%</span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            Status:
                          </span>
                          <span className="text-xs px-2 py-1 rounded-full bg-muted">
                            {player.completed ? "Completed" : "In Progress"}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex items-center justify-center gap-4">
        <Button
          variant="outline"
          onClick={() => setTab(tab === "results" ? "stats" : "results")}
        >
          <Rotate className="h-4 w-4 mr-2" />
          {tab === "results" ? "View Detailed Stats" : "View Results"}
        </Button>

        <Button onClick={handleNewGame}>
          <Home className="h-4 w-4 mr-2" />
          Back to Lobby
        </Button>
      </div>

      <div className="mt-12 p-4 rounded-lg bg-muted/50 border">
        <h3 className="font-medium mb-2">Passage</h3>
        <p className="text-sm text-muted-foreground font-mono">{passage}</p>
      </div>
    </div>
  );
}
