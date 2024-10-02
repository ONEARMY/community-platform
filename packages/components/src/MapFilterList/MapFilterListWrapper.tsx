import { Flex } from 'theme-ui'

interface IProps {
  children: React.ReactNode
}

export const MapFilterListWrapper = ({ children }: IProps) => (
  <Flex
    as="ul"
    data-cy="MapFilterList"
    sx={{
      listStyle: 'none',
      flexWrap: 'nowrap',
      gap: 2,
      flexDirection: 'column',
      padding: 0,
    }}
  >
    {children}
  </Flex>
)
