import { TextNotification } from 'oa-components';
import { Text } from 'theme-ui';

export type SubmitResults = { type: 'success' | 'error'; message: string };

interface Props {
  submitResults: SubmitResults | null;
}

export const UserContactError = ({ submitResults }: Props) => {
  if (!submitResults) return null;

  const { message, type } = submitResults;

  return (
    <TextNotification isVisible={true} variant={type === 'success' ? 'success' : 'failure'}>
      <Text>{message}</Text>
    </TextNotification>
  );
};
