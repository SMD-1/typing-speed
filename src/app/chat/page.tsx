"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import socket from "@/lib/socket";

export default function ChatPage() {
  const [message, setMessage] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    // Connect the socket when the component mounts
    socket.connect();

    // Cleanup: Disconnect the socket when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(message);
    socket.emit("message", message);
    setMessage("");
  };
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900">
      <Button onClick={() => router.push("/")}>Home</Button>
      <h1 className="text-4xl text-gray-100 font-bold">Chat</h1>
      <p className="mt-4 text-lg">This is the chat page.</p>
      <form onSubmit={submitHandler}>
        <Input
          className="mt-4 w-[200px]"
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </form>
    </div>
  );
}
