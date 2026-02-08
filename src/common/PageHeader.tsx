import { Flex } from 'theme-ui';

type PageHeaderProps = {
  actions?: React.ReactNode;
  children: React.ReactNode;
};

const PageHeader = ({ actions, children }: PageHeaderProps) => {
  return (
    <Flex sx={{ flexWrap: 'wrap', paddingY: 2, paddingX: [2, 0, 0], gap: 1, alignItems: 'center' }}>
      {children}
      {actions && <Flex sx={{ gap: 2, marginLeft: 'auto', justifyContent: 'flex-end' }}>{actions}</Flex>}
    </Flex>
  );
};

export default PageHeader;
