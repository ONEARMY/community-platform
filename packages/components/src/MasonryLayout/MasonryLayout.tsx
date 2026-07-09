import type { ReactNode } from 'react';
import { Children, useEffect, useRef, useState } from 'react';
import { Flex } from 'theme-ui';

interface IProps {
  children: ReactNode;
  breakpoints?: [number, number][];
}

const DEFAULT_BREAKPOINTS: [number, number][] = [
  [1020, 3],
  [520, 2],
];

export const MasonryLayout = ({ children, breakpoints = DEFAULT_BREAKPOINTS }: IProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [colCount, setColCount] = useState(1);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width;
      const cols = breakpoints.find(([minWidth]) => width >= minWidth)?.[1] ?? 1;
      setColCount(cols);
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [breakpoints]);

  const items = Children.toArray(children);
  const columns: ReactNode[][] = Array.from({ length: colCount }, (_, colIndex) =>
    items.filter((_, i) => i % colCount === colIndex),
  );

  return (
    <Flex ref={containerRef} sx={{ gap: 4 }}>
      {columns.map((col, i) => (
        <Flex key={i} sx={{ flexDirection: 'column', flex: 1 }}>
          {col}
        </Flex>
      ))}
    </Flex>
  );
};
