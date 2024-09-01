import { Button } from 'oa-components'
import crossClose from 'src/assets/icons/cross-close.svg'
import checkmarkIcon from 'src/assets/icons/icon-checkmark.svg'
import { Flex, Image, Text } from 'theme-ui'

import type { FilterGroup } from './transformAvailableFiltersToGroups'

interface IProps {
  availableFilters: FilterGroup[]
  selectedItems: Array<string>
  onChange?: (selectedItems: string[]) => void
  onClose: () => void
}

const GroupingFilterMobile = (props: IProps) => {
  const { availableFilters, selectedItems } = props
  const addOrRemoveFilter = (selected, item) => {
    if (selected.includes(item)) {
      return selected.filter((selectedItem) => selectedItem !== item)
    } else {
      return [...selected, item]
    }
  }

  const handleChange = (item: string) => {
    if (props.onChange) {
      props.onChange(addOrRemoveFilter(props.selectedItems, item))
    }
  }

  return (
    <Flex sx={{ flexDirection: 'column' }}>
      <Flex p={0} mx={-1} sx={{ justifyContent: 'space-between' }}>
        <Text sx={{ fontWeight: 'bold' }}>Select filters</Text>
        <Image
          loading="lazy"
          width="25px"
          src={crossClose}
          alt="cross-close"
          onClick={() => props.onClose()}
        />
      </Flex>

      {availableFilters.map((item, idx) => {
        return (
          <div key={idx}>
            <Text
              sx={{
                fontSize: 2,
                display: 'block',
                paddingTop: 2,
                paddingBottom: 2,
              }}
            >
              {item.label}
            </Text>

            {item.options.map((filter) => (
              <Flex
                sx={{
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
                mt="5px"
                onClick={(evt) => {
                  evt.preventDefault()
                  evt.stopPropagation()
                  handleChange(filter.value)
                }}
                key={filter.label}
              >
                <Flex sx={{ alignItems: 'center' }}>
                  {filter.imageElement}
                  <Text sx={{ fontSize: 2 }} ml="10px">
                    {filter.label} ({filter.number})
                  </Text>
                </Flex>
                {selectedItems.includes(filter.value) && (
                  <Image loading="lazy" src={checkmarkIcon} width="20px" />
                )}
              </Flex>
            ))}
          </div>
        )
      })}

      <Button type="button" mt={3} onClick={props.onClose}>
        Apply filters
      </Button>
    </Flex>
  )
}

export { GroupingFilterMobile }
