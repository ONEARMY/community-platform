import { useTheme } from '@emotion/react'
import { Container, Flex, Heading, Image, Input, Text } from 'theme-ui'
import Search from 'src/assets/icons/icon-search.svg'

type Props = {
  total: number
  onSearchChange: (text: string) => void
}

const AdminUserSearch = ({ total, onSearchChange }: Props) => {
  const theme = useTheme()

  return (
    <Container sx={{ my: 5, pb: 2, borderBottom: '2px solid' }}>
      <Flex sx={{ alignItems: 'baseline' }}>
        <Heading>Users </Heading>
        <Text ml={2} sx={{ color: theme.colors.grey }}>
          {total} Total
        </Text>
        <Flex
          ml="auto"
          sx={{
            alignItems: 'center',
            background: 'white',
            px: 2,
            borderRadius: '5px',
          }}
        >
          <Input
            sx={{ background: 'white', ml: 1, border: 'none' }}
            placeholder="Search"
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <Image sx={{ width: 20, height: 20 }} src={Search} />
        </Flex>
      </Flex>
    </Container>
  )
}

export default AdminUserSearch
