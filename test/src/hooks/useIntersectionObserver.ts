// src/hooks/useIntersectionObserver.ts
import { useEffect, useRef } from "react";

type UseIntersectionObserverProps = {
  enabled: boolean;
  onIntersect: () => void;
};

export const useIntersectionObserver = ({
  enabled,
  onIntersect,
}: UseIntersectionObserverProps) => {
  const targetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!enabled || !targetRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onIntersect();
        }
      },
      {
        threshold: 0.3,
      }
    );

    observer.observe(targetRef.current);

    return () => observer.disconnect();
  }, [enabled, onIntersect]);

  return targetRef;
};