import React from "react";
import { Timer as TimerIcon } from "lucide-react";
import { Button } from "./ui/button";

interface TimerProps {
  timeLeft: number;
  duration: number;
  onDurationChange: (duration: number) => void;
}

const Timer: React.FC<TimerProps> = ({
  timeLeft,
  duration,
  onDurationChange,
}) => {
  const durations = [20, 30, 40];

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <TimerIcon className="w-5 h-5 text-indigo-600" />
        <span className="font-medium dark:text-white">{timeLeft}s</span>
      </div>
      <div className="flex gap-2">
        {durations.map((d) => (
          <Button
            key={d}
            onClick={() => onDurationChange(d)}
            className={`p-3 h-3 rounded-full text-sm ${
              duration === d
                ? "bg-primary"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {d}s
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Timer;
