import { useEffect, useState } from 'react'
import { Select } from 'oa-components'
import { useCommonStores } from 'src/common/hooks/useCommonStores'

import { FieldContainer } from '../Form/FieldContainer'

import type { ISelectedTags, ITag } from 'oa-shared'
import type { FieldRenderProps } from 'react-final-form'

// we include props from react-final-form fields so it can be used as a custom field component
export interface IProps extends Partial<FieldRenderProps<any, any>> {
  isForm?: boolean
  value?: ISelectedTags
  onChange: (val: ISelectedTags) => void
  styleVariant?: 'selector' | 'filter'
  placeholder?: string
  tagsSource?: ITag[]
}
interface IState {
  selectedTags: string[]
}

const TagsSelect = (props: IProps) => {
  const { tagsStore } = useCommonStores().stores
  const { allTags } = tagsStore

  const allTagsData = props.tagsSource ? props.tagsSource : allTags
  const [state, setState] = useState<IState>({ selectedTags: [] })

  // if we initialise with a value we want to update the state to reflect the selected tags
  // we repeat this additionally for input in case it is being used as input component for react-final-form field
  useEffect(() => {
    const propsVal = { ...props.value, ...(props.input?.value || []) }
    const selectedTags = Object.keys(propsVal)
    setState({ selectedTags })
    props.onChange(propsVal)
  }, [])

  // emit values as {[tagKey]:true} object to be picked up by field
  const onSelectedTagsChanged = (selected: ITag[]) => {
    const selectedTags = selected.map((tag) => tag._id)
    setState({ selectedTags })
    props.onChange(_tagsArrayToSelectedJson(selectedTags))
  }

  // as react-select can't keep track of which object key corresponds to the selected
  // value include manual lookup so that value can also be passed from props
  const _getSelected = (allTagsData: ITag[]) => {
    return allTagsData?.filter((tag) => state.selectedTags.includes(tag._id))
  }

  // whilst we deal with arrays of selected tag ids in the component we want to store as a json map
  // to make it easier for querying. The next 2 functions handle conversion between formats
  // i.e [tag1,tag2,tag3] <-> {tag1:true, tag2:true, tag3:true}
  const _tagsArrayToSelectedJson = (arr: string[]) => {
    const selectedJson = {}
    arr.forEach((el) => (selectedJson[el] = true))
    return selectedJson
  }

  return (
    <FieldContainer
      // provide a data attribute that can be used to see if tags populated
      data-cy={allTagsData?.length > 0 ? 'tag-select' : 'tag-select-empty'}
    >
      <Select
        variant={props.isForm ? 'form' : undefined}
        options={allTagsData}
        placeholder={props.placeholder}
        isClearable={true}
        isMulti={true}
        value={_getSelected(allTagsData)}
        getOptionLabel={(tag: ITag) => tag.label}
        getOptionValue={(tag: ITag) => tag._id}
        onChange={(values) => onSelectedTagsChanged(values as ITag[])}
      />
    </FieldContainer>
  )
}

export default TagsSelect
