"use client";
import React, { createContext, useContext, useState } from "react";

interface RoomContextType {
  passage: string;
  setPassage: (passage: string) => void;
}

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export const RoomProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [passage, setPassage] = useState<string>("");

  return (
    <RoomContext.Provider value={{ passage, setPassage }}>
      {children}
    </RoomContext.Provider>
  );
};

export const useRoomContext = () => {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error("useRoomContext must be used within a RoomProvider");
  }
  return context;
};
