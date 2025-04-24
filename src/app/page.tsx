"use client";
import Header from "@/components/Header";
import TypeField from "@/components/TypeField";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <Header />
        <TypeField isMultiPlayer={false} hasPassage={false} />
      </div>
    </div>
  );
}
