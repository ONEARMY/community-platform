import { Icon } from 'oa-components';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import ChevronLeftIcon from '@/components/ui/icons/chevron-left.svg?react';
import ChevronRightIcon from '@/components/ui/icons/chevron-right.svg?react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';

import type { ISettingsTab } from './types';

interface IProps {
  tabs: ISettingsTab[];
}

export const SettingsFormTabList = ({ tabs }: IProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [overflow, setOverflow] = useState({ start: false, end: false });

  const updateOverflow = useCallback(() => {
    const element = scrollRef.current;
    if (!element) {
      return;
    }
    setOverflow({
      start: element.scrollLeft > 0,
      end: element.scrollLeft + element.clientWidth < element.scrollWidth - 1,
    });
  }, []);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) {
      return;
    }
    updateOverflow();
    const observer = new ResizeObserver(updateOverflow);
    observer.observe(element);
    return () => observer.disconnect();
  }, [updateOverflow, tabs.length]);

  if (tabs.length === 1) {
    return null;
  }

  const scroll = (direction: -1 | 1) => {
    const element = scrollRef.current;
    element?.scrollBy({ left: (direction * element.clientWidth) / 2, behavior: 'smooth' });
  };

  return (
    <div className="flex min-w-0 items-center gap-1 group-data-vertical/tabs:contents">
      {overflow.start && (
        <Button
          variant="outline"
          size="icon-sm"
          tabIndex={-1}
          aria-hidden
          data-cy="tabs-scroll-start"
          className="mb-2 group-data-vertical/tabs:hidden"
          onClick={() => scroll(-1)}
        >
          <ChevronLeftIcon />
        </Button>
      )}
      <TabsList
        ref={scrollRef}
        onScroll={updateOverflow}
        variant="outline"
        className="group-data-horizontal/tabs:min-w-0 group-data-horizontal/tabs:flex-1"
      >
        {tabs.map(({ glyph, title, route }) => (
          <TabsTrigger
            key={title}
            value={route}
            data-cy={`tab-${title}`}
            nativeButton={false}
            render={<Link to={route} />}
          >
            <Icon glyph={glyph} size={20} /> {title}
          </TabsTrigger>
        ))}
      </TabsList>
      {overflow.end && (
        <Button
          variant="outline"
          size="icon-sm"
          tabIndex={-1}
          aria-hidden
          data-cy="tabs-scroll-end"
          className="mb-2 group-data-vertical/tabs:hidden"
          onClick={() => scroll(1)}
        >
          <ChevronRightIcon />
        </Button>
      )}
    </div>
  );
};
