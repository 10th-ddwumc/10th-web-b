import {createContext, useContext, useState, type PropsWithChildren} from "react";

export const THEME = {
    LIGHT: 'LIGHT',
    DARK: 'DARK',
} as const;

type TTHEME = typeof THEME[keyof typeof THEME];

interface IThemeContext{
    theme: TTHEME;
    toggleTheme: () => void;
}

export const ThemeContext = createContext<IThemeContext | undefined>(undefined);

export const ThemeProvider = ({ children }: PropsWithChildren<{}>) => {
    const [theme, setTheme] = useState<TTHEME>(THEME.LIGHT);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === THEME.LIGHT ? THEME.DARK : THEME.LIGHT));
    };

    return <ThemeContext.Provider value={{ theme: theme, toggleTheme: toggleTheme }}>
            {children}
        </ThemeContext.Provider>;
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }

    return context;
};