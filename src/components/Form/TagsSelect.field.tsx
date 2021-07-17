import TagsSelect from '../Tags/TagsSelect'

export const TagsSelectField = ({ input, ...rest }) => (
  <TagsSelect
    {...rest}
    onChange={tags => input.onChange(tags)}
    category={rest.category}
    value={input.value}
  />
)
