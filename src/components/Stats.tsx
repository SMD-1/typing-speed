import React from "react";
import { TypingStats } from "../types";

interface StatsProps {
  stats: TypingStats;
}

const Stats: React.FC<StatsProps> = ({ stats }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Speed</h3>
          <p className="mt-1 text-2xl font-semibold text-indigo-600">
            {stats.wpm} WPM
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Accuracy</h3>
          <p className="mt-1 text-2xl font-semibold text-green-600">
            {stats.accuracy}%
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Characters</h3>
          <p className="mt-1 text-2xl font-semibold text-blue-600">
            {stats.correctChars}/{stats.totalChars}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Stats;
