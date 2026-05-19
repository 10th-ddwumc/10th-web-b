// src/hooks/useThrottle.ts
import { useEffect, useRef, useState } from "react";

const useThrottle = <T,>(value: T, interval: number) => {
  const [throttledValue, setThrottledValue] = useState<T>(value);

  const lastExecutedTimeRef = useRef<number>(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const now = Date.now();

    if (lastExecutedTimeRef.current === 0) {
      lastExecutedTimeRef.current = now;
      setThrottledValue(value);
      return;
    }

    const elapsedTime = now - lastExecutedTimeRef.current;

    if (elapsedTime >= interval) {
      setThrottledValue(value);
      lastExecutedTimeRef.current = now;
      return;
    }

    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }

    timerRef.current = window.setTimeout(() => {
      setThrottledValue(value);
      lastExecutedTimeRef.current = Date.now();
    }, interval - elapsedTime);

    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, [value, interval]);

  return throttledValue;
};

export default useThrottle;