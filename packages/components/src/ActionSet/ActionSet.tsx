import { useEffect, useRef, useState } from 'react';
import { Card, Flex } from 'theme-ui';

import { Button } from '../Button/Button';

import type { ReactNode } from 'react';

interface IProps {
  children: ReactNode[];
  itemType: 'ReplyItem' | 'CommentItem';
}

export const ActionSet = ({ children, itemType }: IProps) => {
  const [show, setShow] = useState<boolean>(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const toDisplay = children.filter((child) => !!child);
  if (!children || toDisplay.length === 0) {
    return <></>;
  }

  const onClick = () => setShow((show) => !show);

  useEffect(() => {
    const handleClickOutsideDropdownCard = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setShow((prev) => !prev);
      }
    };

    if (show) document.addEventListener('mousedown', handleClickOutsideDropdownCard);

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideDropdownCard);
    };
  }, [show]);

  return (
    <Flex
      ref={cardRef}
      sx={{
        display: 'inline-block',
        position: 'relative',
        gap: 2,
      }}
    >
      <Button
        data-cy={`${itemType}: ActionSetButton`}
        icon="more-vert"
        onClick={onClick}
        variant="subtle"
        small={true}
        showIconOnly
      >
        Show Actions
      </Button>

      {show && (
        <Card
          sx={{
            position: 'absolute',
            right: 0,
            zIndex: 10,
            gap: 1,
            minWidth: '200px',
          }}
        >
          <Flex
            sx={{
              alignItems: 'stretch',
              justifyItems: 'stretch',
              flexDirection: 'column',
            }}
          >
            {...children}
          </Flex>
        </Card>
      )}
    </Flex>
  );
};
