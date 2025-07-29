import { Flex, Text } from 'theme-ui'

export const DraftTag = () => {
  return (
    <Flex
      sx={{
        marginBottom: 'auto',
        minWidth: '100px',
        borderRadius: 1,
        height: '44px',
        background: 'lightgrey',
      }}
    >
      <Text
        sx={{
          display: 'inline-block',
          verticalAlign: 'middle',
          color: 'black',
          fontSize: [2, 2, 3],
          padding: 2,
          margin: 'auto',
        }}
        data-cy="draft-tag"
      >
        Draft
      </Text>
    </Flex>
  )
}
