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
      flexWrap: 'wrap',
      gap: 2,
      flexDirection: 'row',
      padding: 0,
    }}
  >
    {children}
  </Flex>
)
