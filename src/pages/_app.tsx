import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useState, useEffect } from "react";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { Toaster } from "react-hot-toast";

export default function App({ Component, pageProps }: AppProps) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("buddy-dark-mode");
    if (stored !== null) {
      setDarkMode(stored === "true");
    } else {
      setDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("buddy-dark-mode", String(darkMode));
  }, [darkMode]);

  return (
    <AuthProvider>
      <Component
        {...pageProps}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode((prev) => !prev)}
      />
      <Toaster
        position="top-right"
        toastOptions={{
          className: "!bg-white dark:!bg-slate-800 !text-slate-900 dark:!text-slate-100 !shadow-lg !border !border-slate-200 dark:!border-slate-700",
          duration: 4000,
        }}
      />
    </AuthProvider>
  );
}
