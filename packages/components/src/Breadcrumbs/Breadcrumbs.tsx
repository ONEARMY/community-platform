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
        marginLeft: -1,
        marginTop: [2, 2, 7],
        padding: 0,
        alignItems: 'center',
        width: '100%',
      }}
    >
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        return (
          <Flex
            key={index}
            sx={{
              alignItems: 'center',
              ...(isLast && { flex: '1', minWidth: 0 }),
            }}
          >
            <BreadcrumbItem text={step.text} link={step.link} isLast={isLast} />
            {!isLast && (
              <Icon
                glyph="chevron-right"
                color="black"
                marginRight="8px"
                data-testid="breadcrumbsChevron"
              />
            )}
          </Flex>
        );
      })}
    </Flex>
  );
};
