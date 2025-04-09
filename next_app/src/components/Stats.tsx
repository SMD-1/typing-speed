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
  ResponsiveContainer,
} from "recharts";

interface StatsProps {
  stats: TypingStats;
  history: TypingHistory[];
}

const Stats: React.FC<StatsProps> = ({ stats, history }) => {
  console.log("stats", stats);
  console.log("history", history);
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm dark:bg-gray-800">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-200">
            Speed
          </h3>
          <p className="mt-1 text-2xl font-semibold text-indigo-600 dark:text-indigo-400">
            {stats.wpm} WPM
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm dark:bg-gray-800">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-200">
            Accuracy
          </h3>
          <p className="mt-1 text-2xl font-semibold text-green-600 dark:text-green-400">
            {stats.accuracy}%
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm dark:bg-gray-800">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-200">
            Characters
          </h3>
          <p className="mt-1 text-2xl font-semibold text-blue-600 dark:text-blue-400">
            {stats.correctChars}/{stats.totalChars}
          </p>
        </div>

        <div
          className="bg-white p-4 rounded-lg shadow-sm col-span-3 dark:bg-gray-800"
          style={{ height: "300px" }}
        >
          <h3 className="text-sm font-medium text-gray-500 mb-4 dark:text-gray-200">
            Performance Over Time
          </h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history}>
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
                yAxisId="right"
                type="monotone"
                dataKey="accuracy"
                stroke="#059669"
                name="Accuracy %"
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="wpm"
                stroke="#4f46e5"
                name="WPM"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Stats;
