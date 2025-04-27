"use client";
import Header from "@/components/Header";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ChevronLeft,
  Clock,
  Flag,
  Loader2,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Clipboard } from "@/components/Clipboard";
import { CountdownTimer } from "@/components/CountdownTimer";
import { GameResults } from "@/components/GameResults";
import { getSocket } from "@/lib/socket";
import { PlayerList } from "@/components/PlayerList";
import { TypingInterface } from "@/components/TypingInterface";

interface Player {
  id?: string;
  username: string | null;
  progress: number;
  wpm: number;
  accuracy: number;
  completed: boolean;
  position: number;
  finishTime?: number;
}

interface Room {
  id: string;
  host?: string;
  players: Player[];
  passage: string;
  started: boolean;
  completed: boolean;
}

const Room = () => {
  const { roomId } = useParams() as { roomId: string };
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState<Room | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [countdownActive, setCountdownActive] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Restore state from localStorage
    const savedUsername = localStorage.getItem("username");
    setUsername(savedUsername || "");

    const socket = getSocket();

    // Join the room
    socket.emit("join-room", {
      roomId,
      username: savedUsername,
    });

    // Listen for room data
    socket.on("room-joined", (room) => {
      console.log("Joined room:", room);
      setRoom(room);
      setIsLoading(false);
      setIsHost(socket.id === room.host);
    });

    socket.on("room-created", ({ roomId, passage }) => {
      setRoom({
        id: roomId,
        host: socket.id,
        players: [
          {
            id: socket.id,
            username: savedUsername,
            progress: 0,
            wpm: 0,
            accuracy: 100,
            completed: false,
            position: 1,
          },
        ],
        passage,
        started: false,
        completed: false,
      });
      setIsLoading(false);
      setIsHost(true);
    });

    // When a new player joins
    socket.on("player-joined", ({ players }) => {
      setRoom((prev) => (prev ? { ...prev, players } : null));
    });

    // When a player leaves
    socket.on("player-left", ({ players }) => {
      setRoom((prev) => (prev ? { ...prev, players } : null));
    });

    // When host changes
    socket.on("new-host", ({ hostId }) => {
      setRoom((prev) => (prev ? { ...prev, host: hostId } : null));
      setIsHost(socket.id === hostId);
    });

    // Game started
    socket.on("game-started", () => {
      setCountdownActive(true);
      setTimeout(() => {
        setCountdownActive(false);
        setGameStarted(true);
      }, 3000); // 3 second countdown
    });

    // Progress updates
    socket.on("progress-updated", ({ players }) => {
      setRoom((prev) => (prev ? { ...prev, players } : null));
    });

    // Game completed
    socket.on("game-completed", ({ players }) => {
      setRoom((prev) => (prev ? { ...prev, players, completed: true } : null));
      setGameCompleted(true);
    });

    // Handle errors
    socket.once("error", ({ message }) => {
      setError(message);
      setIsLoading(false);
    });

    // Cleanup: Disconnect the socket when the component unmounts
    return () => {
      socket.off("room-joined");
      socket.off("room-created");
      socket.off("player-joined");
      socket.off("player-left");
      socket.off("new-host");
      socket.off("game-started");
      socket.off("progress-updated");
      socket.off("game-completed");
      socket.off("error");
    };
  }, [roomId]);

  console.log("Room:", room);

  // Handle start game
  const handleStartGame = () => {
    if (!isHost || !room) return;

    const socket = getSocket();
    socket.emit("start-game", roomId);
  };

  // Handle leave room
  const handleLeaveRoom = () => {
    router.push("/multi-player");
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 dark:bg-gray-900">
        <div className="max-w-5xl mx-auto space-y-8">
          <Header />
          <div className="flex items-center justify-between w-full pr-4">
            <div className="flex items-center gap-2 rounded-lg py-2 px-4 text-gray-500">
              {error}
            </div>
            <Button variant="outline" onClick={handleLeaveRoom}>
              <ChevronLeft className="h-4 w-4" />
              Back to lobby
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Connecting to room...</p>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <p className="text-destructive text-lg mb-4">Room not found</p>
          <Button onClick={handleLeaveRoom}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Lobby
          </Button>
        </div>
      </div>
    );
  }
  const handleProgressUpdate = (
    progress: number,
    wpm: number,
    accuracy: number
  ) => {
    if (!room || !gameStarted) return;

    const socket = getSocket();
    socket.emit("update-progress", { roomId, progress, wpm, accuracy });
  };

  console.log("yoooooooooooooo", room?.players);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/90 flex flex-col">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <Button variant="ghost" onClick={handleLeaveRoom}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Lobby
          </Button>

          <div className="flex items-center space-x-6">
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm">{room?.players?.length} players</span>
            </div>

            <div className="flex items-center">
              <Flag className="h-4 w-4 mr-2 text-muted-foreground" />
              <div className="flex items-center text-sm">
                Room: <Clipboard text={roomId} />
              </div>
            </div>
          </div>
        </div>

        {countdownActive ? (
          <CountdownTimer duration={3} />
        ) : gameCompleted ? (
          <GameResults players={room.players} passage={room.passage} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <TypingInterface
                text={room.passage} // fallback to empty string if no passage
                gameStarted={gameStarted}
                onProgress={handleProgressUpdate}
              />

              {!gameStarted && isHost && (
                <div className="mt-6 text-center">
                  <Button
                    className="w-full sm:w-auto"
                    size="lg"
                    onClick={handleStartGame}
                    disabled={room.players.length < 1}
                  >
                    {room.players.length < 1
                      ? "Waiting for players..."
                      : "Start Game"}
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">
                    You are the host. Click to start the game when everyone is
                    ready.
                  </p>
                </div>
              )}

              {!gameStarted && !isHost && (
                <div className="mt-6 text-center">
                  <p className="text-lg">
                    Waiting for host to start the game...
                  </p>
                  <div className="mt-2 flex items-center justify-center">
                    <Clock className="animate-pulse h-5 w-5 mr-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Get ready! The race will begin soon.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {room?.players?.length > 0 && (
              <div className="lg:col-span-1">
                <PlayerList
                  players={room.players}
                  currentPlayerId={getSocket().id}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Room;
