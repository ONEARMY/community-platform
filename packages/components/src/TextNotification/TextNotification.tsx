import { keyframes } from '@emotion/react';
import { Alert, Close } from 'theme-ui';

const fadeIn = keyframes({
  from: { opacity: 0, transform: 'translateY(-50%)' },
  to: { opacity: 1 },
});

export interface TextNotificationProps {
  children: any;
  variant: 'success' | 'failure';
  isVisible: boolean;
  onDismiss?: any | null;
}

export const TextNotification = (props: TextNotificationProps) => {
  if (!props.isVisible) {
    return <></>;
  }

  return (
    <Alert
      variant={props.variant}
      data-cy={`TextNotification: ${props.variant}`}
      sx={{
        width: '100%',
        animation: `${fadeIn} ease-out 400ms both 200ms`,
      }}
    >
      {props.children}
      {props.onDismiss && (
        <Close
          sx={{
            position: 'absolute',
            top: '50%',
            right: 2,
            transform: 'translateY(-50%)',
            cursor: 'pointer',
          }}
          onClick={() => props.onDismiss(false)}
        />
      )}
    </Alert>
  );
};
