import { useCallback } from "react";

export const useLocalStorage = (key: string) => {
    const safeExecute = <T>(action: () => T, errorMsg: string): T | null => {
        try {
            return action();
        } catch (error) {
            console.error(`${errorMsg}:`, error);
            return null;
        }
    };

    const setItem = useCallback((value: unknown) => {
        safeExecute(() => window.localStorage.setItem(key, JSON.stringify(value)), "localStorage setItem error");
    }, [key]);

    const getItem = useCallback(() => {
        return safeExecute(() => {
            const item = window.localStorage.getItem(key);
            if (!item) return null;
            try {
                return JSON.parse(item);
            } catch {
                return item;
            }
        }, "localStorage getItem error");
    }, [key]);

    const removeItem = useCallback(() => {
        safeExecute(() => window.localStorage.removeItem(key), "localStorage removeItem error");
    }, [key]);

    return { setItem, getItem, removeItem }
}