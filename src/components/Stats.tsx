import React from "react";
import { TypingHistory, TypingStats } from "../types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface StatsProps {
  stats: TypingStats;
  history: TypingHistory[];
}

const Stats: React.FC<StatsProps> = ({ stats, history }) => {
  console.log(history);
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

        <div className="bg-white p-4 rounded-lg shadow-sm border-2 border-red-500">
          <h3 className="text-sm font-medium text-gray-500 mb-4">
            Performance Over Time
          </h3>
          <LineChart width={600} height={300} data={history}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(value) => new Date(value).toLocaleTimeString()}
            />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="wpm"
              stroke="#4f46e5"
              name="WPM"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="accuracy"
              stroke="#059669"
              name="Accuracy %"
            />
          </LineChart>
        </div>
      </div>
    </div>
  );
};

export default Stats;
