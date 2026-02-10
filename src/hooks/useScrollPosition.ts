import { useState, useEffect } from 'react';

interface ScrollPosition {
  scrollX: number;
  scrollY: number;
  scrollDirection: 'up' | 'down' | null;
  isAtTop: boolean;
  isAtBottom: boolean;
}

/**
 * Хук для отслеживания позиции скролла
 * @returns объект с позицией и направлением скролла
 */
export function useScrollPosition(): ScrollPosition {
  const [position, setPosition] = useState<ScrollPosition>({
    scrollX: 0,
    scrollY: 0,
    scrollDirection: null,
    isAtTop: true,
    isAtBottom: false
  });

  useEffect(() => {
    let prevScrollY = window.scrollY;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const scrollX = window.scrollX;
      const scrollDirection = scrollY > prevScrollY ? 'down' : scrollY < prevScrollY ? 'up' : null;
      
      const isAtTop = scrollY <= 0;
      const isAtBottom = window.innerHeight + scrollY >= document.body.scrollHeight - 10;

      setPosition({
        scrollX,
        scrollY,
        scrollDirection,
        isAtTop,
        isAtBottom
      });

      prevScrollY = scrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return position;
}

export default useScrollPosition;
