"use client";
import Header from "@/components/Header";
import TypeField from "@/components/TypeField";
import socket from "@/lib/socket";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Clipboard } from "@/components/Clipboard";

interface Player {
  id: string;
  username: string;
  progress: number;
  wpm: number;
  accuracy: number;
  completed: boolean;
  position: number;
  finishTime?: number;
}

interface Room {
  id: string;
  host: string;
  players: Player[];
  passage: string;
  started: boolean;
  completed: boolean;
}

const Room = () => {
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const roomData = localStorage?.getItem("roomData");
  const room = roomData ? JSON.parse(roomData) : null;

  useEffect(() => {
    // Connect the socket when the component mounts
    socket.connect();

    // Restore state from localStorage
    const savedUsername = localStorage.getItem("username");
    const savedRoomId = room?.roomId;

    if (savedUsername && savedRoomId) {
      setUsername(savedUsername);
      setRoomId(savedRoomId);

      // Rejoin the room
      socket.emit("join-room", {
        roomId: savedRoomId,
        username: savedUsername,
      });

      // Listen for room data
      socket.once("room-joined", (room) => {
        console.log("Joined room:", room.roomId);
      });

      // Handle errors
      socket.once("error", ({ message }) => {
        setError(message);
      });
    }

    // Cleanup: Disconnect the socket when the component unmounts
    return () => {
      socket.disconnect();
      console.log("Disconnected from socket");
    };
  }, []);

  const handleLeaveRoom = () => {
    // Clear localStorage
    localStorage.removeItem("username");
    localStorage.removeItem("roomData");

    // Disconnect socket and navigate to home
    socket.disconnect();
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
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto space-y-8">
        <Header />
        <div className="flex items-center justify-between w-full pr-4">
          <div className="flex items-center gap-2 rounded-lg py-2 px-4 text-gray-500">
            # Room id: <Clipboard text={roomId} />
          </div>
          <Button variant="outline" onClick={handleLeaveRoom}>
            <ChevronLeft className="h-4 w-4" />
            Back to lobby
          </Button>
        </div>
        <TypeField isMultiPlayer={true} hasPassage={true} />
      </div>
    </div>
  );
};

export default Room;
