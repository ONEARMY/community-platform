import { CardList, FilterList } from 'oa-components'
import { Flex, Heading } from 'theme-ui'

import type { IMapPin } from 'src/models'

interface IProps {
  activePinFilters: string[]
  availableFilters: any
  filteredPins: IMapPin[] | null
  onFilterChange: (label: string) => void
  pins: IMapPin[]
  viewport: 'desktop' | 'mobile'
}

export const MapWithListHeader = (props: IProps) => {
  const {
    activePinFilters,
    availableFilters,
    filteredPins,
    onFilterChange,
    pins,
    viewport,
  } = props
  const isMobile = viewport === 'mobile'

  return (
    <>
      <Flex
        sx={{
          flexDirection: 'column',
          backgroundColor: 'background',
          gap: 2,
          paddingY: 2,
          paddingTop: isMobile ? '50px' : 2,
        }}
      >
        <Heading
          data-cy="welome-header"
          sx={{
            paddingX: 4,
          }}
          variant={isMobile ? 'small' : 'heading'}
        >
          Welcome to our world!{' '}
          {pins && `${pins.length} members (and counting...)`}
        </Heading>

        <FilterList
          activeFilters={activePinFilters}
          availableFilters={availableFilters}
          onFilterChange={onFilterChange}
        />
      </Flex>
      <CardList
        columnsCountBreakPoints={isMobile ? { 300: 1, 600: 2 } : undefined}
        dataCy={viewport}
        list={pins}
        filteredList={filteredPins}
      />
    </>
  )
}
