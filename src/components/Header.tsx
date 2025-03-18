import { Moon, Sun } from "lucide-react";
// import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useTheme } from "@/context/ThemeContext";

const Header = () => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const logoTitle = "<Type racer />";

  return (
    <div className="logo flex justify-between">
      <div className="flex flex-col ">
        <p className="font-semibold text-2xl dark:text-gray-200">{`${logoTitle}`}</p>
        <p className="dark:text-gray-400 text-gray-600 text-xs">
          Test your typing speed and accuracy
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button
          className="rounded-md dark:bg-gray-700 bg-gray-200 px-4 py-[6px] dark:text-gray-200"
          onClick={() => navigate("/login")}
        >
          Sign in
        </button>
        {/* light/dark theme button */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          aria-label="Toggle dark mode"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
};

export default Header;
