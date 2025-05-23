"use client";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authClient } from "@/lib/auth-client";
import { getSocket, initializeSocket } from "@/lib/socket";
import { ChevronLeft, KeyRound, UserPlus, UsersRound } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Multiplayer = () => {
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { data: session } = authClient.useSession();

  useEffect(() => {
    // Initialize socket connection
    initializeSocket();
    // Connect the socket when the component mounts
    if (session) {
      setUsername(session?.user.name ?? "");
    }
  }, [session]);

  const handleCreateRoom = async () => {
    if (!username.trim()) {
      setError("Please enter a username");
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      const socket = getSocket();

      // Create a new room
      socket.emit("create-room", {
        username: username,
        userId: session?.user.id,
      });

      // Listen for room creation confirmation
      socket.once("room-created", ({ roomId }) => {
        // Save data in localstorage
        localStorage.setItem("username", username);
        localStorage.setItem("userId", session?.user.id ?? "");
        router.push(`/multi-player/${roomId}`);
      });

      // Handle errors
      socket.once("error", ({ message }) => {
        setError(message);
        setIsCreating(false);
      });
    } catch (err) {
      console.log("Error creating room:", err);
      setError("Failed to create room. Please try again.");
      setIsCreating(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!username.trim() || !roomId.trim()) {
      setError("Please enter a username and room ID");
      return;
    }

    setIsJoining(true);
    setError(null);

    try {
      localStorage.setItem("username", username);

      router.push(`/multi-player/${roomId}`);
    } catch (err) {
      console.log("Error joining room:", err);
      setError("Failed to join room. Please try again.");
      setIsJoining(false);
    }
  };

  return (
    <div className="p-4 dark:bg-gray-900 h-screen ">
      <div className=" max-w-5xl mx-auto space-y-8">
        <Header />
        <div className="flex flex-col items-center mt-8">
          <Card className="border-2 border-border/50 max-w-2xl shadow-lg dark:bg-gray-800">
            <button
              className="flex items-center gap-2 w-fit text-sm font-medium text-gray-700 dark:text-gray-300 mb border border-gray-300 dark:border-gray-600 p-2 ml-6 rounded-md cursor-pointer"
              onClick={() => router.push("/")}
            >
              <ChevronLeft className="w-4 h-4" /> Home
            </button>
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                Join a Typing Race
              </CardTitle>
              <CardDescription className="text-center">
                Create a new room or join an existing one
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="mb-4">
                <Label htmlFor="username">Your Name</Label>
                <div className="relative mt-1">
                  <Input
                    id="username"
                    placeholder={session?.user.name ?? "Enter your name"}
                    value={username}
                    disabled={!!username.trim()}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10"
                  />
                  <UsersRound className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              {error && (
                <p className="text-sm text-destructive mb-4">{error}</p>
              )}

              <Tabs defaultValue="create" className="mt-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="create">Create Room</TabsTrigger>
                  <TabsTrigger value="join">Join Room</TabsTrigger>
                </TabsList>

                <TabsContent value="create" className="mt-4">
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Create a new room and invite friends to join you for a
                      typing race.
                    </p>

                    <Button
                      className="w-full"
                      onClick={handleCreateRoom}
                      disabled={isCreating || !username.trim()}
                    >
                      {isCreating ? "Creating..." : "Create New Room"}
                      <UserPlus className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="join" className="mt-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="roomId">Room ID</Label>
                      <div className="relative mt-1">
                        <Input
                          id="roomId"
                          placeholder="Enter room ID"
                          value={roomId}
                          onChange={(e) => setRoomId(e.target.value)}
                          className="pl-10 uppercase"
                        />
                        <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>

                    <Button
                      className="w-full"
                      onClick={handleJoinRoom}
                      disabled={isJoining || !username.trim() || !roomId.trim()}
                    >
                      {isJoining ? "Joining..." : "Join Room"}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>

            <CardFooter className="flex justify-center border-t pt-4 text-xs text-muted-foreground">
              <p>Race against friends to see who types the fastest!</p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Multiplayer;
