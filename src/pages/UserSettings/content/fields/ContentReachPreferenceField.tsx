import { contentReachSettings, type SelectValue } from 'oa-shared';
import { useField } from 'react-final-form';
import { Flex, Label, Radio, Text } from 'theme-ui';

export const ContentReachRadioOptions = () => {
  const name = 'contentReach';
  const { input } = useField(name);
  const selectedValue = input.value?.value;

  const handleRadioChange = (option: SelectValue) => {
    input.onChange(option);
  };

  if (!input.value?.value) {
    return null;
  }

  return (
    <Flex
      sx={{
        flexDirection: 'column',
        gap: 4,
        width: '100%',
        paddingRight: 2,
        paddingLeft: 7,
      }}
    >
      {contentReachSettings
        .filter((x) => x.value !== null)
        .map((option) => (
          <Label
            key={option.value}
            sx={{
              alignItems: 'center',
              margin: 'auto',
              cursor: 'pointer',
              ':hover': {
                opacity: 0.8,
              },
              width: '100%',
            }}
          >
            <Flex sx={{ flexDirection: 'column', flex: 1, gap: 1 }}>
              {option.preferencesLabel}

              <Text sx={{ color: 'gray', fontSize: 2 }}>{option.description}</Text>
            </Flex>

            <Radio
              name={`${name}-radio`}
              value={option.value?.toString() || ''}
              checked={selectedValue === option.value?.toString()}
              onChange={() =>
                handleRadioChange({
                  value: option.value?.toString() || null,
                  label: option.contentLabel,
                })
              }
              sx={{
                'input:checked ~ &': {
                  color: '#20b7eb',
                },
                'input:focus ~ &': {
                  backgroundColor: '#fff',
                },
              }}
            />
          </Label>
        ))}
    </Flex>
  );
};
