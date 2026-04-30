import type { EmailContentReach } from 'oa-shared';
import { useEffect, useState } from 'react';
import { useField } from 'react-final-form';
import { emailContentReachService } from 'src/services/emailContentReachService';
import { Switch } from 'theme-ui';

export const EmailContentReachSwitch = () => {
  const [options, setOptions] = useState<EmailContentReach[]>([]);
  const { input } = useField('emailContentReach');
  const isEnabled = !!input.value;

  useEffect(() => {
    const fetchEmailContentReach = async () => {
      const emailContentReach = await emailContentReachService.getAll();
      emailContentReach && setOptions(emailContentReach);
    };
    fetchEmailContentReach();
  }, []);

  const handleSwitchToggle = () => {
    if (isEnabled) {
      input.onChange(null);
    } else {
      // When enabling, select the first option by default
      const defaultOption = options[0];
      if (defaultOption) {
        input.onChange({
          value: defaultOption.id.toString(),
          label: defaultOption.preferencesLabel,
        });
      }
    }
  };

  return (
    <Switch
      checked={isEnabled}
      onChange={handleSwitchToggle}
      sx={{
        'input:checked ~ &': {
          backgroundColor: '#20b7eb',
        },
      }}
    />
  );
};
