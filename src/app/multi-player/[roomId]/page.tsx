"use client";
import Header from "@/components/Header";
import TypeField from "@/components/TypeField";

const Room = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto space-y-8">
        <Header />
        <TypeField isMultiPlayer={true} hasPassage={true} />
      </div>
    </div>
  );
};

export default Room;
