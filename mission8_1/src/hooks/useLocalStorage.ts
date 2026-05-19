import { useCallback } from "react";

export const useLocalStorage = (key: string) => {
    const setItem = useCallback((value: unknown) => {
        try {
            window.localStorage.setItem(key, JSON.stringify(value));
        }
        catch (error) {
            console.log(error)
        }
    }, [key]);

    const getItem = useCallback(() => {
        try {
            const item = window.localStorage.getItem(key);
            if (!item) return null;
            try {
                return JSON.parse(item);
            } catch {
                return item;
            }
        } catch (e) {
            console.error("localStorage getItem error:", e);
            return null;
        }
    }, [key]);

    const removeItem = useCallback(() => {
        try {
            window.localStorage.removeItem(key);
        } catch (error) {
            console.log(error)
        }
    }, [key]);

    return { setItem, getItem, removeItem }
}