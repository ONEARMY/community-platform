import { TagsSelect } from '../Tags/TagsSelect';

export const TagsSelectField = ({ input, ...rest }) => (
  <TagsSelect
    styleVariant="selector"
    placeholder="Select tags (max 4)"
    isForm={true}
    onChange={(tags) => input.onChange(tags)}
    value={input.value}
    {...rest}
  />
);
