import { useState } from "react";
import { CircleUserRound, LogOut, Moon, Sun } from "lucide-react";
import { useNavigate } from "react-router";
import { useTheme } from "@/context/ThemeContext";
import { authClient } from "@/lib/auth-client";

const Header = () => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, isPending, error, refetch } = authClient.useSession();
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
        {/* 1) if error then show error in Profile */}
        {error && (
          <div className="flex items-center justify-center">
            <p className="text-red-500">Error: {error.message}</p>
          </div>
        )}
        {/* 2) if isPending is true then show loading in Profile */}
        {isPending && (
          <div className="flex items-center justify-center">
            <p className="text-gray-500">Loading...</p>
          </div>
        )}
        {/* 3) if session is null then show login button in Profile */}
        {!session && !isPending && !error && (
          <button
            className="rounded-md dark:bg-gray-700 bg-gray-200 px-4 py-[6px] dark:text-gray-200"
            onClick={() => navigate("/login")}
          >
            Sign in
          </button>
        )}
        {/* light/dark theme button */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          aria-label="Toggle dark mode"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        {/* 4) if session is not null then show profile image in Profile */}
        {session && (
          <div className="relative">
            <div
              className="rounded-full w-10 h-10 cursor-pointer"
              onClick={() => setIsOpen(!isOpen)}
            >
              {session?.user?.image ? (
                <img
                  src={session.user.image}
                  referrerPolicy="no-referrer"
                  alt="Profile"
                  className="rounded-full w-full h-full object-cover"
                />
              ) : (
                <CircleUserRound className="w-full h-full dark:text-gray-200 text-gray-900" />
              )}
            </div>

            {isOpen && (
              <div className="absolute top-12 right-0 bg-white dark:bg-gray-800 shadow-xl rounded-lg p-4 w-40 z-10 divide-y divide-gray-600">
                <p
                  className="text-gray-700 dark:text-gray-200 truncate pb-2"
                  title={session.user.name}
                >
                  {session.user.name}
                </p>
                <button
                  className=" text-red-500 flex justify-between w-full items-center pt-2"
                  onClick={() => {
                    authClient.signOut();
                    refetch();
                  }}
                >
                  Log out{" "}
                  <span>
                    {" "}
                    <LogOut height={20} />
                  </span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
