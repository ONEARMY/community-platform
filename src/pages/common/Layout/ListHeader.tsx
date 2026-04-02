import { Flex, Heading, Text } from 'theme-ui';

interface IProps {
  itemCount: number;
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
          paddingTop: [6, 6, 12],
          flexDirection: 'column',
          gap: [4, 4, 8],
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
      <Flex sx={{ flexDirection: 'column', gap: 2 }}>
        <Flex
          sx={{
            justifyContent: 'space-between',
            flexDirection: ['column', 'row', 'row'],
            gap: [2, 2, 2],
            maxWidth: '100%',
          }}
        >
          <Flex
            sx={{
              flexDirection: ['column', 'column', 'row'],
              gap: [2, 2, 2],
              width: ['100%', '100%', 'auto'],
              alignItems: ['flex-start', 'flex-start', 'center'],
              display: ['none', 'none', 'flex'],
            }}
          >
            {!showDrafts && filteringComponents}
          </Flex>
          <Flex
            sx={{
              justifyContent: 'space-between',
              width: ['100%', '100%', 'auto'],
              flexShrink: 0,
            }}
          >
            {mobileFilteringComponents ?? null}
            {actionComponents}
          </Flex>
        </Flex>
        <Flex sx={{ gap: 4, lineHeight: '1.5rem' }}>
          {!searchString ? (
            <Flex
              sx={{
                flexDirection: 'row',
                justifyContent: ['space-between', 'space-between', 'flex-start'],
                alignItems: 'center',
                width: ['100%', '100%', 'auto'],
              }}
            >
              <Text>{`${itemCount} ${itemLabel}`}</Text>
            </Flex>
          ) : (
            <Flex
              sx={{
                flexDirection: 'row',
                justifyContent: ['space-between', 'space-between', 'flex-start'],
                alignItems: 'center',
                width: ['100%', '100%', 'auto'],
              }}
            >
              <Text>{searchString && `${itemCount} ${itemLabel} for "${searchString}"`}</Text>
            </Flex>
          )}
        </Flex>
      </Flex>
    </>
  );
};
