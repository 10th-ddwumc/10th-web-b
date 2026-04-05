//src/components/ThemeToggleButton.tsx
import { THEME, useTheme } from "../context/ThemeProvider";
import clsx from "clsx";

export default function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();
  const isLightMode = theme === THEME.LIGHT;

  return (
    <button
      onClick={toggleTheme}
      className={clsx(
        "px-6 py-3 rounded-full text-base font-semibold shadow-md transition-all duration-200",
        isLightMode
          ? "bg-white text-black border border-gray-300 hover:bg-gray-300"
          : "bg-gray-700 text-white border border-gray-600 hover:bg-gray-500",
      )}
    >
      {isLightMode ? "다크 모드" : "라이트 모드"}
    </button>
  );
}