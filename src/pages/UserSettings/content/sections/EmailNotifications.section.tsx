import * as React from 'react';
import { Field } from 'react-final-form';
import { observer } from 'mobx-react';
import { Select } from 'oa-components';
import { EmailNotificationFrequency } from 'oa-shared';
import { FieldContainer } from 'src/common/Form/FieldContainer';

import type { INotificationSettings } from 'oa-shared';

interface IProps {
  notificationSettings?: INotificationSettings;
}

const emailFrequencyOptions: {
  value: EmailNotificationFrequency;
  label: string;
}[] = [
  { value: EmailNotificationFrequency.NEVER, label: 'Never (Unsubscribed)' },
  { value: EmailNotificationFrequency.DAILY, label: 'Daily' },
  { value: EmailNotificationFrequency.WEEKLY, label: 'Weekly' },
  { value: EmailNotificationFrequency.MONTHLY, label: 'Monthly' },
];

export const EmailNotificationsSection = observer((props: IProps) => {
  const defaultValue = React.useMemo(
    () =>
      emailFrequencyOptions.find(
        ({ value }) =>
          value ===
          (props.notificationSettings?.emailFrequency ?? EmailNotificationFrequency.NEVER),
      ),
    [props.notificationSettings?.emailFrequency],
  );
  return (
    <FieldContainer data-cy="NotificationSettingsSelect">
      <Field name="notification_settings.emailFrequency">
        {({ input }) => {
          return (
            <Select
              options={emailFrequencyOptions}
              defaultValue={defaultValue}
              onChange={({ value }) => input.onChange(value)}
            />
          );
        }}
      </Field>
    </FieldContainer>
  );
});
