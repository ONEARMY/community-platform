import { useEffect, useState } from 'react';
import { Select } from 'oa-components';
import { FieldContainer } from 'src/common/Form/FieldContainer';
import { profilesService } from 'src/services/profilesService';
import { useDebouncedCallback } from 'use-debounce';

export interface IOption {
  value: string;
  label: string;
}

interface IProps {
  input: {
    value: string[];
    onChange: (v: string[]) => void;
  };
  placeholder?: string;
  isForm?: boolean;
}

export const UserNameSelect = (props: IProps) => {
  const { input, placeholder } = props;
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<IOption[]>([]);

  const loadOptions = async (inputVal: string) => {
    if (!inputVal) {
      setOptions([]);
      return;
    }

    const profiles = await profilesService.search(inputVal);
    const options = profiles.map((x) => ({
      label: x.username,
      value: x.username,
    }));

    setOptions(options);
  };

  const debounceLoad = useDebouncedCallback((q: string) => loadOptions(q), 500);

  useEffect(() => {
    debounceLoad(inputValue);
  }, [inputValue]);

  const value = input.value?.length
    ? input.value.map((user) => ({
        value: user,
        label: user,
      }))
    : [];

  return (
    <FieldContainer data-cy="UserNameSelect">
      <Select
        variant="form"
        options={options}
        placeholder={placeholder}
        value={value}
        onChange={(v: IOption[]) => input.onChange(v.map((user) => user.value))}
        onInputChange={setInputValue}
        isClearable={true}
        isMulti={true}
        noOptionsMessage={(i) => (i.inputValue ? 'Not found' : 'Search users')}
      />
    </FieldContainer>
  );
};
