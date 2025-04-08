import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Route, Routes } from "react-router";
import Login from "./components/Login.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { Signup } from "./components/Signup.tsx";
import Leaderboard from "./components/Leaderboard.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create-account" element={<Signup />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);
