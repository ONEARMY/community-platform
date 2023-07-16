import { FieldContainer } from 'src/common/Form/FieldContainer'
import { CategoriesSelect } from 'src/pages/Howto/Category/CategoriesSelect'
import { Flex, Input } from 'theme-ui'
import { Select } from 'oa-components'
import { ItemSortingOption } from 'src/stores/common/FilterSorterDecorator/FilterSorterDecorator'

export const ResearchListSortFilterHeader = (props: {
  setter: (prevState: any) => void
  state: {
    category: string
    sort: string
    search: string
  }
}) => {
  const { setter, state } = props

  const sortingOptions = [
    ItemSortingOption.Created,
    ItemSortingOption.Modified,
    ItemSortingOption.MostUseful,
    ItemSortingOption.Comments,
    ItemSortingOption.Updates,
  ]?.map((label) => ({
    label: label.replace(/([a-z])([A-Z])/g, '$1 $2'),
    value: label,
  }))

  const _inputStyle = {
    width: ['100%', '100%', '240px'],
    mr: [0, 0, 2],
    mb: [3, 3, 0],
  }

  return (
    <Flex
      sx={{
        flexWrap: 'nowrap',
        justifyContent: 'space-between',
        flexDirection: ['column', 'column', 'row'],
        mb: 3,
      }}
    >
      <Flex sx={_inputStyle}>
        <CategoriesSelect
          value={state?.category ? { label: state?.category } : null}
          onChange={(category) => {
            setter((prevState) => ({
              ...prevState,
              category: category ? category.label : null,
            }))
          }}
          placeholder="Filter by category"
          isForm={false}
          type={'research'}
        />
      </Flex>
      <Flex sx={_inputStyle}>
        <FieldContainer>
          <Select
            options={sortingOptions}
            placeholder="Sort by"
            value={state?.sort}
            onChange={(sortBy) => {
              setter((prevState) => ({
                ...prevState,
                sort: sortBy,
              }))
            }}
          />
        </FieldContainer>
      </Flex>
      <Flex sx={_inputStyle}>
        <Input
          variant="inputOutline"
          data-cy={`research-search-box`}
          value={state.search}
          placeholder={`Search for a research article`}
          onChange={(evt) => {
            const value = evt.target.value
            setter((prevState) => ({
              ...prevState,
              search: value,
            }))
          }}
        />
      </Flex>
    </Flex>
  )
}
