import { Select } from 'oa-components';
import type { SelectValue } from 'oa-shared';
import { useEffect, useState } from 'react';
import { Field } from 'react-final-form';
import { emailContentReachService } from 'src/services/emailContentReachService';
import { Box } from 'theme-ui';

export const EmailContentReachPreferenceField = () => {
  const [options, setOptions] = useState<SelectValue[]>([]);
  const name = 'emailContentReach';

  useEffect(() => {
    const fetchEmailContentReach = async () => {
      const emailContentReach = await emailContentReachService.getAllAsSelectValue();
      emailContentReach && setOptions(emailContentReach);
    };
    fetchEmailContentReach();
  }, []);

  return (
    <Box sx={{ width: '100%', marginX: [6, 6, 8] }}>
      <Field
        name={name}
        id={name}
        render={({ input, ...rest }) => {
          return (
            <Select
              {...rest}
              variant="form"
              options={options}
              value={input.value}
              onChange={(changedValue) => {
                input.onChange(changedValue);
              }}
            />
          );
        }}
      />
    </Box>
  );
};
