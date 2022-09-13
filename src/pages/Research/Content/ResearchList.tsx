import { observer } from 'mobx-react'
import { Box, Flex, Heading, Text } from 'theme-ui'
import { AuthWrapper } from 'src/common/AuthWrapper'
import { Button, Icon } from 'oa-components'
import ResearchListItem from './ResearchListItem'
import { useResearchStore } from 'src/stores/Research/research.store'
import { useTheme } from '@emotion/react'
import { Link } from 'react-router-dom'
import styled from '@emotion/styled'
import theme from 'src/themes/styled.theme'
import { useCommonStores } from 'src'

const ResearchListHeader = styled.header`
  display: grid;
  grid-template-columns: 2fr minmax(274px, 1fr);
  gap: 60px;
  padding: 15px;
  margin-bottom: 16px;

  @media (max-width: ${theme.breakpoints[0]}) {
    display: none;
    grid-template-columns: unset;
    gap: unset;
  }
`

const ResearchList = observer(() => {
  const store = useResearchStore()
  const { aggregationsStore } = useCommonStores().stores
  const { aggregations } = aggregationsStore
  const theme = useTheme()

  const { filteredResearches } = store
  return (
    <>
      <Flex my={[18, 26]}>
        <Heading
          sx={{
            width: '100%',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: theme.fontSizes[5],
          }}
        >
          Research topics. Can we...
        </Heading>
      </Flex>
      <ResearchListHeader>
        <Text color={theme.colors.black} sx={{ fontSize: '16px' }}>
          Title
        </Text>

        <Flex sx={{ alignItems: 'center', justifyContent: 'space-around' }}>
          <Text
            color={theme.colors.black}
            sx={{ display: 'flex', alignItems: 'center', fontSize: '16px' }}
          >
            <Icon glyph="star-active" mr={1} />
            Useful
          </Text>
          <Text
            color={theme.colors.black}
            sx={{ display: 'flex', alignItems: 'center', fontSize: '16px' }}
          >
            <Icon glyph="comment" mr={1} />
            Comments
          </Text>
          <Text color={theme.colors.black} sx={{ fontSize: '16px' }}>
            Updates
          </Text>
        </Flex>
      </ResearchListHeader>
      {filteredResearches.map((item) => {
        const votedUsefulCount = aggregations.users_votedUsefulResearch
          ? aggregations.users_votedUsefulResearch[item._id] || 0
          : '...'

        return (
          <ResearchListItem
            key={item._id}
            item={{
              ...item,
              votedUsefulCount,
            }}
          />
        )
      })}
      <Box mb={[3, 3, 0]}>
        <Link to={store.activeUser ? '/research/create' : 'sign-up'}>
          <AuthWrapper roleRequired="beta-tester">
            <Button>Add Research</Button>
          </AuthWrapper>
        </Link>
      </Box>
    </>
  )
})
export default ResearchList
