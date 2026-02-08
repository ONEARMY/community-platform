import { Flex } from 'theme-ui';

import { Icon } from '../Icon/Icon';
import { BreadcrumbItem } from './BreadcrumbsItem';

type Step = { text: string; link?: string };

export interface BreadcrumbsProps {
  steps: Step[];
}

export const Breadcrumbs = ({ steps }: BreadcrumbsProps) => {
  return (
    <Flex
      sx={{
        alignItems: 'center',
        width: '100%',
        overflowX: 'auto',
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': {
          display: 'none',
        },
      }}
    >
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        return (
          <Flex
            key={index}
            sx={{
              alignItems: 'center',
              flexShrink: isLast ? 1 : 0,
              ...(isLast && { flex: '1' }),
            }}
          >
            <BreadcrumbItem text={step.text} link={step.link} isLast={isLast} />
            {!isLast && <Icon glyph="chevron-right" color="black" data-testid="breadcrumbsChevron" />}
          </Flex>
        );
      })}
    </Flex>
  );
};
