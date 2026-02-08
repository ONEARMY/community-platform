import { Breadcrumbs as BreadcrumbsComponent } from 'oa-components';
import { Flex } from 'theme-ui';

type BreadcrumbStep = { text: string; link?: string };

interface BreadcrumbsProps {
  children?: React.ReactNode;
  steps: BreadcrumbStep[];
}

export const Breadcrumbs = (props: BreadcrumbsProps) => {
  const { steps } = props;

  return (
    <Flex
      sx={{
        alignItems: 'baseline',
        justifyContent: 'space-between',
        flexDirection: 'row',
        flexWrap: 'wrap',
      }}
    >
      <Flex
        sx={{
          flex: ['none', 'none', 1],
          overflowX: 'auto',
          width: '100%',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        <BreadcrumbsComponent steps={steps} />
      </Flex>
    </Flex>
  );
};
