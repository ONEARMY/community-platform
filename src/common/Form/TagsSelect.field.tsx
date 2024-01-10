import TagsSelect from '../Tags/TagsSelect'

export const TagsSelectField = ({ input, ...rest }) => (
  <TagsSelect
    {...rest}
    isForm={true}
    onChange={(tags) => input.onChange(tags)}
    value={input.value}
  />
)
