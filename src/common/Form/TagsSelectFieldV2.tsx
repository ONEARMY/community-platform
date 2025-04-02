import TagsSelectV2 from '../Tags/TagsSelectV2'

export const TagsSelectFieldV2 = ({ input, ...rest }) => (
  <TagsSelectV2
    styleVariant="selector"
    placeholder="Select tags (max 4)"
    isForm={true}
    onChange={(tags) => input.onChange(tags)}
    value={input.value}
    {...rest}
  />
)
