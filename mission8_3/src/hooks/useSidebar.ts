import { useState, useCallback, useEffect } from 'react';

/**
 * useSidebar hook to manage sidebar state and accessibility features.
 * Includes ESC key listener and background scroll lock.
 */
export const useSidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const open = useCallback(() => setIsOpen(true), []);
    const close = useCallback(() => setIsOpen(false), []);
    const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

    useEffect(() => {
        if (!isOpen) return;

        // 3) ESC 키로 닫기 기능 구현
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                close();
            }
        };

        // 4) 배경 스크롤 방지 (body overflow hidden)
        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = 'hidden';

        window.addEventListener('keydown', handleKeyDown);

        // 클린업 함수를 통해 리스너 해제 및 스크롤 복구
        return () => {
            document.body.style.overflow = originalStyle;
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, close]);

    return { isOpen, open, close, toggle };
};
