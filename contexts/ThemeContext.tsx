"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Check for system preference on mount
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = prefersDark ? "dark" : "light";
    setTheme(initialTheme);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    // Apply theme to <html>
    const html = document.documentElement;
    html.classList.remove("light", "dark");
    html.classList.add(theme);
    
    // Update CSS custom properties for smooth transitions
    if (theme === "dark") {
      html.style.setProperty("--background", "222.2 84% 4.9%");
      html.style.setProperty("--foreground", "210 40% 98%");
      html.style.setProperty("--border", "217.2 32.6% 17.5%");
    } else {
      html.style.setProperty("--background", "0 0% 100%");
      html.style.setProperty("--foreground", "222.2 84% 4.9%");
      html.style.setProperty("--border", "214.3 31.8% 91.4%");
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used inside ThemeProvider");
  return context;
}