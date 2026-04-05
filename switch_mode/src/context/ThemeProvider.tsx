//src/context/ThemeProvider.tsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";

export const THEME = {
  LIGHT: "LIGHT",
  DARK: "DARK",
} as const;

type TTheme = typeof THEME.LIGHT | typeof THEME.DARK;

interface IThemeContext {
  theme: TTheme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<IThemeContext | undefined>(undefined);

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const [theme, setTheme] = useState<TTheme>(THEME.LIGHT);

  const toggleTheme = () => {
    setTheme((prevTheme) =>
      prevTheme === THEME.LIGHT ? THEME.DARK : THEME.LIGHT,
    );
  };

  useEffect(() => {
    const isLightMode = theme === THEME.LIGHT;
    const root = document.getElementById("root");

    document.documentElement.style.margin = "0";
    document.documentElement.style.padding = "0";
    document.documentElement.style.width = "100%";
    document.documentElement.style.height = "100%";
    document.documentElement.style.backgroundColor = isLightMode
      ? "#f3f4f6"
      : "#111827";

    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.width = "100%";
    document.body.style.minHeight = "100vh";
    document.body.style.backgroundColor = isLightMode ? "#f3f4f6" : "#111827";
    document.body.style.color = isLightMode ? "#111827" : "#f9fafb";
    document.body.style.transition = "background-color 0.3s ease, color 0.3s ease";

    if (root) {
      root.style.width = "100%";
      root.style.minHeight = "100vh";
      root.style.maxWidth = "100%";
      root.style.margin = "0";
      root.style.padding = "0";
      root.style.backgroundColor = isLightMode ? "#f3f4f6" : "#111827";
      root.style.transition = "background-color 0.3s ease";
    }

    return () => {
      document.documentElement.removeAttribute("style");
      document.body.removeAttribute("style");
      if (root) {
        root.removeAttribute("style");
      }
    };
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};