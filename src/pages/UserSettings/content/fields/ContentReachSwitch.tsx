import { ContentReach, contentReachSettings } from 'oa-shared';
import { useField } from 'react-final-form';
import { Switch } from 'theme-ui';

export const ContentReachSwitch = () => {
  const { input } = useField('contentReach');
  const isEnabled = !!input.value?.value;

  const handleSwitchToggle = () => {
    if (isEnabled) {
      input.onChange(null);
    } else {
      input.onChange({
        value: 'important' satisfies ContentReach,
        label: contentReachSettings.find((x) => x.value === 'important')!.contentLabel,
      });
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
