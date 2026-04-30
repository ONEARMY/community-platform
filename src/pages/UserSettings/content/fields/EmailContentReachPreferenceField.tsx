import type { EmailContentReach, SelectValue } from 'oa-shared';
import { useEffect, useState } from 'react';
import { useField } from 'react-final-form';
import { emailContentReachService } from 'src/services/emailContentReachService';
import { Flex, Label, Radio, Text } from 'theme-ui';

type EmailContentReachRadioOptionsProps = {
  show: boolean;
};

export const EmailContentReachRadioOptions = ({ show }: EmailContentReachRadioOptionsProps) => {
  const [options, setOptions] = useState<EmailContentReach[]>([]);
  const name = 'emailContentReach';
  const { input } = useField(name);
  const selectedValue = input.value?.value;

  useEffect(() => {
    const fetchEmailContentReach = async () => {
      const emailContentReach = await emailContentReachService.getAll();
      if (emailContentReach) {
        setOptions(emailContentReach);
      }
    };
    fetchEmailContentReach();
  }, []);

  const handleRadioChange = (option: SelectValue) => {
    input.onChange(option);
  };

  if (!show || options.length === 0) {
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
      {options.map((option) => (
        <Label
          key={option.id}
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

            <Text sx={{ color: 'gray', fontSize: 2 }}>{option.preferencesDescription}</Text>
          </Flex>

          <Radio
            name={`${name}-radio`}
            value={option.id.toString() || ''}
            checked={selectedValue === option.id.toString()}
            onChange={() =>
              handleRadioChange({ value: option.id.toString(), label: option.preferencesLabel })
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
