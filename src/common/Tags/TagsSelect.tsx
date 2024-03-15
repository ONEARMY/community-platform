import { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import { Select } from 'oa-components'
import { useCommonStores } from 'src/common/hooks/useCommonStores'

import { FieldContainer } from '../Form/FieldContainer'

import type { FieldRenderProps } from 'react-final-form'
import type { ISelectedTags, ITag } from 'src/models/tags.model'

import './tagsselect.css'

// we include props from react-final-form fields so it can be used as a custom field component
export interface IProps extends Partial<FieldRenderProps<any, any>> {
  isForm?: boolean
  value?: ISelectedTags
  onChange: (val: ISelectedTags) => void
  styleVariant?: 'selector' | 'filter'
  placeholder?: string
}
interface IState {
  selectedTags: string[]
}

const TagsSelect = (props: IProps) => {
  const { tagsStore } = useCommonStores().stores
  const { allTags } = tagsStore
  const [state, setState] = useState<IState>({ selectedTags: [] })
  const [error, setError] = useState<string | null>(null)

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
  const _getSelected = (allTags: ITag[]) => {
    return allTags?.filter((tag) => state.selectedTags.includes(tag._id))
  }

  // whilst we deal with arrays of selected tag ids in the component we want to store as a json map
  // to make it easier for querying. The next 2 functions handle conversion between formats
  // i.e [tag1,tag2,tag3] <-> {tag1:true, tag2:true, tag3:true}
  const _tagsArrayToSelectedJson = (arr: string[]) => {
    const selectedJson = {}
    arr.forEach((el) => (selectedJson[el] = true))
    return selectedJson
  }

  const handleTagsChange = (values: any) => {
    if (values.length > 4) {
      setError('No more than four tags are allowed')
    } else {
      setError(null)
      onSelectedTagsChanged(values as ITag[])
    }
  }

  return (
    <FieldContainer
      // provide a data attribute that can be used to see if tags populated
      data-cy={allTags?.length > 0 ? 'tag-select' : 'tag-select-empty'}
    >
      <div id="tagselect-wrapper">
        <Select
          variant={props.isForm ? 'form' : undefined}
          options={allTags}
          placeholder={props.placeholder}
          isClearable={true}
          isMulti={true}
          value={_getSelected(allTags)}
          getOptionLabel={(tag: ITag) => tag.label}
          getOptionValue={(tag: ITag) => tag._id}
          onChange={handleTagsChange}
        />
        {error && (
          <span id="errortext" style={{ color: 'red' }}>
            {error}
          </span>
        )}
      </div>
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
  styleVariant: 'selector',
  placeholder: 'Select tags (max 4)',
}

export default observer(TagsSelect)
