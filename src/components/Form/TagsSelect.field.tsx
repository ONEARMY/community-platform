import TagsSelect from '../Tags/TagsSelect'

export const TagsSelectField = ({ input, meta, ...rest }) => (
  <TagsSelect
    {...rest}
    onChange={tags => input.onChange(tags)}
    category={rest.category}
    value={input.value}
  />
)
