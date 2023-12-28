import { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import { Select } from 'oa-components'

import { FieldContainer } from '../Form/FieldContainer'
import { useCommonStores } from 'src/index'

import type { FieldRenderProps } from 'react-final-form'
import type { ISelectedTags, ITag, TagCategory } from 'src/models/tags.model'

// we include props from react-final-form fields so it can be used as a custom field component
export interface IProps extends Partial<FieldRenderProps<any, any>> {
  isForm?: boolean
  value?: ISelectedTags
  onChange: (val: ISelectedTags) => void
  category?: TagCategory | undefined
  styleVariant?: 'selector' | 'filter'
  placeholder?: string
  relevantTagsItems?: ICollectionWithTags[]
}
interface IState {
  selectedTags: string[]
}

interface ICollectionWithTags {
  tags?: ISelectedTags
}

const TagsSelect = (props: IProps) => {
  const { tagsStore } = useCommonStores().stores
  let { categoryTags } = tagsStore
  const [state, setState] = useState<IState>({ selectedTags: [] })

  // if we initialise with a value we want to update the state to reflect the selected tags
  // we repeat this additionally for input in case it is being used as input component for react-final-form field
  useEffect(() => {
    const propsVal = { ...props.value, ...(props.input?.value || []) }
    const selectedTags = Object.keys(propsVal)
    setState({ selectedTags })
    props.onChange(propsVal)
    tagsStore.setTagsCategory(props.category)
  }, [])

  // emit values as {[tagKey]:true} object to be picked up by field
  const onSelectedTagsChanged = (selected: ITag[]) => {
    const selectedTags = selected.map((tag) => tag._id)
    setState({ selectedTags })
    props.onChange(_tagsArrayToSelectedJson(selectedTags))
  }

  // as react-select can't keep track of which object key corresponds to the selected
  // value include manual lookup so that value can also be passed from props
  const _getSelected = (categoryTags: ITag[]) => {
    return categoryTags?.filter((tag) => state.selectedTags.includes(tag._id))
  }

  // whilst we deal with arrays of selected tag ids in the component we want to store as a json map
  // to make it easier for querying. The next 2 functions handle conversion between formats
  // i.e [tag1,tag2,tag3] <-> {tag1:true, tag2:true, tag3:true}
  const _tagsArrayToSelectedJson = (arr: string[]) => {
    const selectedJson = {}
    arr.forEach((el) => (selectedJson[el] = true))
    return selectedJson
  }

  // we want to display only those tags that return results, meaning they are used by how-tos, events, etc
  const _getTagCounts = (items: ICollectionWithTags[]) => {
    const tagCounts: { [key: string]: number } = {}

    items.map(
      (item) =>
        item.tags &&
        Object.keys(item.tags).forEach(
          (tag) => (tagCounts[tag] = (tagCounts[tag] || 0) + 1),
        ),
    )

    return tagCounts
  }

  if (props.relevantTagsItems) {
    const tagCounts = _getTagCounts(props.relevantTagsItems)
    categoryTags = categoryTags.filter((tag) =>
      Object.keys(tagCounts).includes(tag._id),
    )
  }

  return (
    <FieldContainer
      // provide a data attribute that can be used to see if tags populated
      data-cy={categoryTags?.length > 0 ? 'tag-select' : 'tag-select-empty'}
    >
      <Select
        variant={props.isForm ? 'form' : undefined}
        options={categoryTags}
        placeholder={props.placeholder}
        isClearable={true}
        isMulti={true}
        value={_getSelected(categoryTags)}
        getOptionLabel={(tag: ITag) => tag.label}
        getOptionValue={(tag: ITag) => tag._id}
        onChange={(values) => onSelectedTagsChanged(values as ITag[])}
      />
    </FieldContainer>
  )
}

// use default (non-named) export to save accidentally importing instead of styled component

TagsSelect.defaultProps = {
  input: {
    name: 'tagsSelect',
    onBlur: () => null,
    onChange: () => null,
    onFocus: () => null,
    value: {},
  },
  meta: {},
  value: {},
  category: undefined,
  styleVariant: 'selector',
  placeholder: 'Select tags (max 4)',
}

export default observer(TagsSelect)
