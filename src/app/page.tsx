"use client";
import Header from "@/components/Header";
import TypeField from "@/components/TypeField";
// import socket from "@/lib/socket";

export default function Home() {
  // useEffect(() => {
  //   socket.connect();

  //   socket.on("connect", () => {
  //     console.log("✅ Connected to server, socket ID:", socket.id);
  //   });
  //   socket.on("welcome", (data) => {
  //     console.log("👋", data);
  //   });
  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <Header />
        <TypeField />
      </div>
    </div>
  );
}
