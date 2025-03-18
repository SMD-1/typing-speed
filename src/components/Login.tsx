import { useTheme } from "@/context/ThemeContext";
import { useNavigate } from "react-router";

const Login = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  return (
    <div className={`${isDark ? "dark" : ""}`}>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-12 px-4 dark:bg-gray-900">
        <h1>Login</h1>
        <button
          className="dark:text-gray-200 dark:bg-gray-600 bg-gray-200 px-4 py-2 rounded-md"
          onClick={() => navigate("/")}
        >
          Home
        </button>
      </div>
    </div>
  );
};

export default Login;
