import { useState, useEffect, useRef } from "react";

export function useThrottle<T>(value: T, interval: number): T {
    const [throttledValue, setThrottledValue] = useState<T>(value);
    const lastExecuted = useRef<number>(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const valueRef = useRef<T>(value);

    valueRef.current = value;

    useEffect(() => {
        const now = Date.now();
        const remainingTime = interval - (now - lastExecuted.current);

        if (remainingTime <= 0) {
            setThrottledValue(valueRef.current);
            lastExecuted.current = now;
            if (timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }
        } else if (!timerRef.current) {
            timerRef.current = setTimeout(() => {
                setThrottledValue(valueRef.current);
                lastExecuted.current = Date.now();
                timerRef.current = null;
            }, remainingTime);
        }
        return () => {
        };
    }, [value, interval]);

    // 언마운트 시 명확한 정리
    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    return throttledValue;
}
