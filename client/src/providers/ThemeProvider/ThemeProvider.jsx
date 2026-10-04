import { createContext, useCallback, useEffect, useMemo, useState } from "react";

export const ThemeContext = createContext({
  theme: "light",
  setTheme: () => {},
  toggleTheme: () => {},
});

const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(() => {
    if (typeof window === "undefined") {
      return "light";
    }

    try {
      return window.localStorage.getItem("ebm-theme") === "dark"
        ? "dark"
        : "light";
    } catch {
      return "light";
    }
  });

  const setTheme = useCallback((nextTheme) => {
    if (nextTheme !== "light" && nextTheme !== "dark") {
      return;
    }

    setThemeState(nextTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((currentTheme) =>
      currentTheme === "dark" ? "light" : "dark",
    );
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.style.colorScheme = theme;
    try {
      window.localStorage.setItem("ebm-theme", theme);
    } catch {
      // Theme remains active for the current session when storage is unavailable.
    }
  }, [theme]);

  const values = useMemo(
    () => ({ theme, setTheme, toggleTheme }),
    [setTheme, theme, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={values}>{children}</ThemeContext.Provider>
  );
};

export default ThemeProvider;
