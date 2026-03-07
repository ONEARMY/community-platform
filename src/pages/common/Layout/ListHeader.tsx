import { Flex, Heading, Text } from 'theme-ui';

interface IProps {
  itemCount?: number;
  actionComponents: React.ReactNode;
  headingTitle: string;
  categoryComponent: React.ReactNode;
  filteringComponents: React.ReactNode;
  showDrafts: boolean;
  mobileFilteringComponents?: React.ReactNode;
  searchString?: string;
}

export const ListHeader = (props: IProps) => {
  const {
    itemCount,
    actionComponents,
    headingTitle,
    showDrafts,
    categoryComponent,
    filteringComponents,
    mobileFilteringComponents,
    searchString,
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
          justifyContent: 'space-between',
          flexDirection: ['column', 'row', 'row'],
          gap: [2, 2, 2],
          paddingX: [2, 0],
          maxWidth: '100%',
        }}
      >
        <Flex
          sx={{
            flexDirection: ['column', 'column', 'row'],
            gap: [2, 2, 2],
            width: ['100%', '100%', 'auto'],
            alignItems: ['flex-start', 'flex-start', 'center'],
            display: ['none', 'flex', 'flex'],
          }}
        >
          {!showDrafts && filteringComponents}
          {itemCount !== undefined && itemCount != null && (
            <Flex
              sx={{
                flexDirection: 'row',
                justifyContent: ['space-between', 'space-between', 'flex-start'],
                alignItems: 'center',
                width: ['100%', '100%', 'auto'],
              }}
            >
              <Text sx={{ marginLeft: [0, 0, 2] }}>{`${itemCount} ${itemLabel}`}</Text>
            </Flex>
          )}
        </Flex>
        <Flex
          sx={{
            gap: 2,
            alignSelf: ['flex-start', 'flex-start', 'flex-end'],
            display: ['flex', 'flex', 'flex'],
            justifyContent: ['space-between', 'space-between', 'flex-start'],
            width: ['100%', 'auto', 'auto'],
            flexShrink: 0,
          }}
        >
          {mobileFilteringComponents ?? null}
          {actionComponents}
        </Flex>
        <Flex
          sx={{
            flexDirection: ['column', 'column', 'row'],
            gap: [2, 2, 2],
            width: ['100%', '100%', 'auto'],
            alignItems: ['flex-start', 'flex-start', 'center'],
            display: ['flex', 'none', 'none'],
          }}
        >
          {itemCount !== undefined && itemCount != null && (
            <Flex
              sx={{
                flexDirection: 'row',
                justifyContent: ['space-between', 'space-between', 'flex-start'],
                alignItems: 'center',
                width: ['100%', '100%', 'auto'],
              }}
            >
              <Text sx={{ marginLeft: [0, 0, 2] }}>
                {searchString && `${itemCount} ${itemLabel} for "${searchString}"`}
              </Text>
            </Flex>
          )}
        </Flex>
      </Flex>
    </>
  );
};
