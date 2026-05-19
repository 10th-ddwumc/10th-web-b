import { useCallback, useRef } from 'react'

export function useThrottle<T extends unknown[]>(
  callback: (...args: T) => void,
  interval: number = 1000
): (...args: T) => void {
  const lastCalledRef = useRef<number>(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const throttledFn = useCallback(
    (...args: T) => {
      const now = Date.now()
      const elapsed = now - lastCalledRef.current

      if (elapsed >= interval) {
        // interval이 지났으면 바로 실행
        lastCalledRef.current = now
        callback(...args)
      } else {
        // interval이 안 지났으면 남은 시간 후에 실행
        if (timerRef.current) clearTimeout(timerRef.current)
        timerRef.current = setTimeout(() => {
          lastCalledRef.current = Date.now()
          callback(...args)
        }, interval - elapsed)
      }
    },
    [callback, interval]
  )

  return throttledFn
}