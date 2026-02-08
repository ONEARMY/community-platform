import { Flex } from 'theme-ui';

type PageHeaderProps = {
  actions?: React.ReactNode;
  children: React.ReactNode;
};

const PageHeader = ({ actions, children }: PageHeaderProps) => {
  return (
    <Flex sx={{ flexWrap: 'wrap', paddingY: 2, paddingX: [2, 0, 0], gap: 1, alignItems: 'center', justifyContent: 'space-between' }}>
      {children}
      {actions && <Flex sx={{ gap: 2, width: ['100%', 'auto', 'auto'], justifyContent: 'flex-end' }}>{actions}</Flex>}
    </Flex>
  );
};

export default PageHeader;
