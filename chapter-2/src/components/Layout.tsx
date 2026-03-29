import type { ReactNode } from 'react';
import { THEME, useTheme } from '../context/ThemeProvider';
import clsx from 'clsx';

interface LayoutProps {
    children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
    const { theme } = useTheme();
    const isLightMode = theme === THEME.LIGHT;

    return (
        <div className={clsx(
            'min-h-screen w-full transition-colors',
            isLightMode ? 'bg-white text-black' : 'bg-[#111827] text-white'
        )}>
            {children}
        </div>
    );
};