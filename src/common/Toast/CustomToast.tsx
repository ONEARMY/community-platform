import { Icon } from 'oa-components';
import { commonStyles } from 'oa-themes';
import { Link } from 'react-router';
import type { ExternalToast } from 'sonner';
import { toast } from 'sonner';
import { Box, Button, Flex, Text } from 'theme-ui';
import Spinner from '../Spinner';

export interface CustomToastProps {
  message: string;
  description?: string;
  type: 'default' | 'success' | 'info' | 'warning' | 'error' | 'loading';
  actionLink?: {
    href: string;
    label: string;
  };
  actionButton?: {
    label: string;
    callback: () => void;
  };
  toastId?: string | number;
}

const getBorderColor = (type: CustomToastProps['type']) => {
  switch (type) {
    case 'success':
      return commonStyles.colors.green;
    case 'error':
      return commonStyles.colors.red;
    case 'warning':
      return commonStyles.colors.activeYellow;
    case 'info':
      return commonStyles.colors.blue;
    case 'loading':
    default:
      return commonStyles.colors.grey;
  }
};

export const CustomToast = ({
  message,
  description,
  type,
  actionLink,
  actionButton,
  toastId,
}: CustomToastProps) => {
  const handleClose = () => {
    if (toastId) {
      toast.dismiss(toastId);
    }
  };

  return (
    <Box
      sx={{
        border: '2px solid',
        borderRadius: 1,
        backgroundColor: commonStyles.colors.white,
      }}
      data-cy="toast"
    >
      <Flex
        sx={{
          alignItems: 'center',
          gap: 3,
          padding: 3,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
          borderLeft: `6px solid ${getBorderColor(type)}`,
          borderRadius: '3px',
        }}
      >
        <Flex sx={{ alignItems: 'center', flex: 1, minWidth: 0, gap: 2 }}>
          {type === 'loading' && <Spinner />}
          {type !== 'default' && type !== 'loading' && <Icon size={24} glyph={type} />}
          <Flex sx={{ flexDirection: 'column' }}>
            <Text
              data-cy="toast-message"
              sx={{
                fontWeight: 600,
                color: 'black',
              }}
            >
              {message}
            </Text>
            {description && (
              <Text
                data-cy="toast-description"
                sx={{
                  fontSize: 2,
                  color: 'grey',
                }}
              >
                {description}
              </Text>
            )}
          </Flex>
        </Flex>
        {actionLink && (
          <Link
            to={actionLink.href}
            onClick={handleClose}
            data-cy="toast-action-link"
            style={{ fontWeight: 500, color: 'black', textDecoration: 'underline' }}
          >
            {actionLink.label}
          </Link>
        )}
        {actionButton && (
          <Button
            onClick={() => {
              actionButton.callback();
              handleClose();
            }}
            data-cy="toast-action-button"
          >
            {actionButton.label}
          </Button>
        )}
        {!actionLink && !actionButton && (
          <Box
            onClick={handleClose}
            sx={{
              cursor: 'pointer',
            }}
          >
            <Icon glyph="close" size={20} />
          </Box>
        )}
      </Flex>
    </Box>
  );
};

export const createToastOptions = (
  type: 'default' | 'success' | 'info' | 'warning' | 'error',
): ExternalToast => ({
  duration: type === 'error' ? 6000 : 4000,
  unstyled: true,
});
