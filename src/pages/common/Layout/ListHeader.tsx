import { Flex, Heading, Text } from 'theme-ui';

interface IProps {
  itemCount?: number;
  actionComponents: React.ReactNode;
  actionComponentsMaxWidth?: string;
  headingTitle: string;
  categoryComponent: React.ReactNode;
  filteringComponents: React.ReactNode;
  showDrafts: boolean;
}

export const ListHeader = (props: IProps) => {
  const {
    itemCount,
    actionComponents,
    actionComponentsMaxWidth,
    headingTitle,
    showDrafts,
    categoryComponent,
    filteringComponents,
  } = props;

  const itemLabel = itemCount === 1 ? 'item' : 'items';

  const itemLabel = itemCount === 1 ? 'item' : 'items'

  return (
    <>
      <Flex
        sx={{
          paddingTop: [6, 12],
          paddingBottom: [4, 8],
          flexDirection: 'column',
          gap: [4, 8],
        }}
      >
        <Heading
          as="h1"
          sx={{
            marginX: 'auto',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: 5,
          }}
        >
          {headingTitle}
        </Heading>
        <Flex sx={{ justifyContent: 'center' }}>{categoryComponent}</Flex>
      </Flex>
      <Flex
        sx={{
          justifyContent: 'space-between',
          flexDirection: ['column', 'column', 'row'],
          gap: [2, 2, 2],
          paddingX: [2, 0],
          maxWidth: actionComponentsMaxWidth || '100%',
        }}
      >
        <Flex
          sx={{
            flexDirection: ['column', 'column', 'row'],
            gap: [2, 2, 2],
            width: ['100%', '100%', 'auto'],
            alignItems: ['flex-start', 'flex-start', 'center'],
          }}
        >
          <Flex
            sx={{
              width: ['100%', '100%', 'auto'],
              '& > *': { flexGrow: [1, 1, 0] },
            }}
          >
            {!showDrafts ? filteringComponents : <div style={{ width: '100%' }}></div>}
          </Flex>
          <Flex
            sx={{
              flexDirection: 'row',
              justifyContent: ['space-between', 'space-between', 'flex-start'],
              alignItems: 'center',
              width: ['100%', '100%', 'auto'],
            }}
          >
            <Text sx={{ marginLeft: [0, 0, 2] }}>
              {itemCount ? `${itemCount} ${itemLabel}` : ''}
            </Text>
            <Flex sx={{ gap: 2, display: ['flex', 'flex', 'none'] }}>{actionComponents}</Flex>
          </Flex>
        </Flex>
        <Flex
          sx={{
            gap: 2,
            alignSelf: ['flex-start', 'flex-start', 'flex-end'],
            display: ['none', 'none', 'flex'],
          }}
        >
          {actionComponents}
        </Flex>
      </Flex>
    </>
  );
};
