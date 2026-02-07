import { Select } from 'oa-components';
import type { Tag } from 'oa-shared';
import { useEffect, useState } from 'react';
import type { FieldRenderProps } from 'react-final-form';
import { tagsService } from 'src/services/tagsService';
import { FieldContainer } from '../Form/FieldContainer';

// we include props from react-final-form fields so it can be used as a custom field component
export interface IProps extends Partial<FieldRenderProps<any, any>> {
  isForm?: boolean;
  value: number[];
  onChange: (val: number[]) => void;
  styleVariant?: 'selector' | 'filter';
  placeholder?: string;
  maxTotal?: number;
}

export const TagsSelect = (props: IProps) => {
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

  useEffect(() => {
    const initTags = async () => {
      const tags = await tagsService.getAllTags();
      if (!tags) {
        return;
      }

      setAllTags(tags);
    };

    initTags();
  }, []);

  useEffect(() => {
    if (allTags.length > 0 && props.value.length > 0) {
      setSelectedTags(allTags.filter((x) => props.value.includes(x.id)));
    }
  }, [props.value, allTags]);

  const onChange = (tags: Tag[]) => {
    setSelectedTags(tags);
    props.onChange(tags.map((x) => x.id));
  };

  const isOptionDisabled = () => selectedTags.length >= (props.maxTotal || 4);

  return (
    <FieldContainer data-cy="tag-select">
      <Select
        variant={props.isForm ? 'form' : undefined}
        options={allTags}
        placeholder={props.placeholder}
        isClearable={true}
        isOptionDisabled={isOptionDisabled}
        isMulti={true}
        value={selectedTags}
        getOptionLabel={(tag: Tag) => tag.name}
        getOptionValue={(tag: Tag) => tag.id}
        onChange={onChange}
      />
    </FieldContainer>
  );
};
