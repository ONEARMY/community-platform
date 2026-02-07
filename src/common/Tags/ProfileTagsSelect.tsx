import { Select } from 'oa-components';
import type { ProfileCategory, ProfileTag } from 'oa-shared';
import { useEffect, useState } from 'react';
import type { FieldRenderProps } from 'react-final-form';
import { profileTagsService } from 'src/services/profileTagsService';
import { FieldContainer } from '../Form/FieldContainer';

export interface IProps extends Partial<FieldRenderProps<any, any>> {
  value: number[];
  profileType: string | undefined;
  placeholder?: string;
}

const onProfileTypeChange = (profileType: string | undefined): ProfileCategory => {
  if (!profileType || profileType === 'member') {
    return 'member';
  }
  return 'space';
};

export const ProfileTagsSelect = (props: IProps) => {
  const [allTags, setAllTags] = useState<ProfileTag[]>([]);
  const [filteredTags, setFilteredTags] = useState<ProfileTag[]>([]);
  const [selectedTags, setSelectedTags] = useState<ProfileTag[]>([]);

  const setFilters = () => {
    const category = onProfileTypeChange(props.profileType);

    const filteredByType = allTags.filter(({ profileType }) => profileType === category);
    setFilteredTags(filteredByType);
  };

  useEffect(() => {
    const initTags = async () => {
      const tags = await profileTagsService.getAllTags();

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
  }, [allTags, props.value]);

  useEffect(() => {
    setFilters();
  }, [allTags, props.profileType]);

  const onChange = (tags: ProfileTag[]) => {
    setSelectedTags(tags);
    props.onChange(tags.map((x) => x.id));
  };

  const isOptionDisabled = () => selectedTags.length >= (props.maxTotal || 4);

  return (
    <FieldContainer data-cy="profile-tag-select">
      <Select
        variant="form"
        options={filteredTags}
        placeholder={props.placeholder}
        isClearable={true}
        isOptionDisabled={isOptionDisabled}
        isMulti={true}
        value={selectedTags}
        getOptionLabel={(tag: ProfileTag) => tag.name}
        getOptionValue={(tag: ProfileTag) => tag.id}
        onChange={onChange}
      />
    </FieldContainer>
  );
};
