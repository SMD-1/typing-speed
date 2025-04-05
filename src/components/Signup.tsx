import { useTheme } from "@/context/ThemeContext";
import { ChevronLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { authClient } from "../lib/auth-client";

export function Signup() {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    // Handle signup logic here
    await authClient.signUp.email(
      {
        name: name,
        email: email,
        password: password,
      },
      {
        onRequest: () => {
          //show loading
          setLoading(true);
        },
        onSuccess: () => {
          setLoading(false);
          navigate("/");
        },
        onError: (ctx) => {
          if (ctx.error.code === "PASSWORD_TOO_SHORT") {
            setError(
              `${ctx.error.message}, Password must be at least 8 characters`
            );
          } else {
            setError(ctx.error.message);
          }
          setLoading(false);
        },
      }
    );
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 3000); // 3 seconds

      return () => clearTimeout(timer); // Cleanup on unmount or re-run
    }
  }, [error]);

  return (
    <div className={`${isDark ? "dark" : ""}`}>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-12 px-4 dark:bg-gray-900">
        <div className="bg:gray-100 dark:bg-gray-800 w-full max-w-md p-6 rounded-lg shadow-md">
          <button
            className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-6 border border-gray-300 dark:border-gray-600 p-2 rounded-md"
            onClick={() => navigate("/")}
          >
            <ChevronLeft className="w-4 h-4 " /> Home
          </button>
          {error && (
            <div className="my-4 bg-red-500 dark:bg-red-600 rounded-md">
              <p className="text-white p-2 text-sm">{error}</p>
            </div>
          )}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Full name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
              >
                {loading ? "Loading..." : "Create account"}
              </button>
            </div>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={async () => {
                    // Handle Google sign up logic here
                    await authClient.signIn.social(
                      {
                        provider: "google",
                      },
                      {
                        onRequest: () => {
                          //show loading
                          setLoading(true);
                        },
                        onSuccess: () => {
                          setLoading(false);
                          navigate("/");
                        },
                        onError: (ctx) => {
                          setLoading(false);
                          setError(ctx.error.message);
                        },
                      }
                    );
                  }}
                  type="button"
                  className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                >
                  <img
                    className="h-5 w-5 mr-2"
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    alt="Google logo"
                  />
                  Sign up with Google
                </button>
                <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                  Don't have an account?{" "}
                  <button
                    className="hover:underline text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-500"
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </button>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
