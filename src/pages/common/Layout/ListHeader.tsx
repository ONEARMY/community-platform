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
          justifyContent: actionComponents ? 'space-between' : 'flex-start',
          flexDirection: ['row', 'row', 'row'],
          gap: [2, 2, 2],
          paddingX: [2, 0],
          maxWidth: actionComponentsMaxWidth || '100%',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Flex
          sx={{
            flexDirection: ['row', 'row', 'row'],
            gap: [2, 2, 2],
            alignItems: 'center',
            flex: actionComponents ? [1, 1, 1] : 1,
            minWidth: actionComponents ? 'auto' : 0,
            width: actionComponents ? 'auto' : '100%',
          }}
        >
          <Flex
            sx={{
              '& > *': { flexGrow: 0 },
              width: actionComponents ? 'auto' : '100%',
              minWidth: 0,
              flex: actionComponents ? '0 1 auto' : 1,
            }}
          >
            {!showDrafts ? filteringComponents : <div style={{ width: '100%' }}></div>}
          </Flex>
          {/* Item count - show on mobile if there's space, always on desktop */}
          <Text
            sx={{
              margin: 0,
              marginLeft: [0, 0, 2],
              whiteSpace: 'nowrap',
              display: ['none', 'none', 'block'],
            }}
          >
            {itemCount ? `${itemCount} ${itemLabel}` : ''}
          </Text>
        </Flex>
        {actionComponents && (
          <Flex
            sx={{
              gap: 2,
              flexShrink: 0,
            }}
          >
            {actionComponents}
          </Flex>
        )}
      </Flex>
    </>
  );
};
