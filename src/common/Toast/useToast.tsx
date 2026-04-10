import { toast as sonnerToast } from 'sonner';
import {
  CustomToast,
  CustomToast2,
  type CustomToastProps,
  createToastOptions,
} from './CustomToast';

interface ToastOptions
  extends Pick<CustomToastProps, 'description' | 'actionLink' | 'actionButton'> {
  duration?: number;
}

interface PromiseOptions<T>
  extends Pick<CustomToastProps, 'description' | 'actionLink' | 'actionButton'> {
  loading: string;
  success:
    | string
    | ((data: T) => string)
    | ((data: T) => {
        message: string;
        description?: string;
        actionLink?: CustomToastProps['actionLink'];
        actionButton?: CustomToastProps['actionButton'];
      });
  error: string | ((error: any) => string);
  duration?: number;
}

export const useToast = () => {
  const toast = {
    default: (message: string, options?: ToastOptions) => {
      const baseOptions = createToastOptions('default');
      return sonnerToast.custom(
        (toastId) => (
          <CustomToast
            message={message}
            description={options?.description}
            type="default"
            actionLink={options?.actionLink}
            actionButton={options?.actionButton}
            toastId={toastId}
          />
        ),
        {
          duration: options?.duration ?? baseOptions.duration,
          unstyled: true,
        },
      );
    },

    success: (message: string, options?: ToastOptions) => {
      const baseOptions = createToastOptions('success');
      return sonnerToast.custom(
        (toastId) => (
          <CustomToast
            message={message}
            description={options?.description}
            type="success"
            actionLink={options?.actionLink}
            actionButton={options?.actionButton}
            toastId={toastId}
          />
        ),
        {
          duration: options?.duration ?? baseOptions.duration,
          unstyled: true,
        },
      );
    },

    info: (message: string, options?: ToastOptions) => {
      const baseOptions = createToastOptions('info');
      return sonnerToast.custom(
        (toastId) => (
          <CustomToast
            message={message}
            description={options?.description}
            type="info"
            actionLink={options?.actionLink}
            actionButton={options?.actionButton}
            toastId={toastId}
          />
        ),
        {
          duration: options?.duration ?? baseOptions.duration,
          unstyled: true,
        },
      );
    },

    warning: (message: string, options?: ToastOptions) => {
      const baseOptions = createToastOptions('warning');
      return sonnerToast.custom(
        (toastId) => (
          <CustomToast
            message={message}
            description={options?.description}
            type="warning"
            actionLink={options?.actionLink}
            actionButton={options?.actionButton}
            toastId={toastId}
          />
        ),
        {
          duration: options?.duration ?? baseOptions.duration,
          unstyled: true,
        },
      );
    },

    error: (message: string, options?: ToastOptions) => {
      const baseOptions = createToastOptions('error');
      return sonnerToast.custom(
        (toastId) => (
          <CustomToast
            message={message}
            description={options?.description}
            type="error"
            actionLink={options?.actionLink}
            actionButton={options?.actionButton}
            toastId={toastId}
          />
        ),
        {
          duration: options?.duration ?? baseOptions.duration,
          unstyled: true,
        },
      );
    },

    promise: <T,>(promise: Promise<T>, options: PromiseOptions<T>) => {
      // Use custom toast to get access to toastId
      let toastId: string | number;

      // Randomly choose between two toast styles for demonstration
      const ToastComponent = Math.random() < 0.5 ? CustomToast2 : CustomToast;

      toastId = sonnerToast.custom(
        (id) => (
          <ToastComponent
            message={options.loading}
            description={options.description}
            type="loading"
            toastId={id}
          />
        ),
        {
          duration: Infinity, // Keep loading toast until promise resolves
          unstyled: true,
        },
      );

      promise
        .then((data: T) => {
          const result =
            typeof options.success === 'function' ? options.success(data) : options.success;

          let message: string;
          let description: string | undefined;
          let actionLink = options.actionLink;
          let actionButton = options.actionButton;

          if (typeof result === 'object') {
            message = result.message;
            description = result.description;
            actionLink = result.actionLink ?? actionLink;
            actionButton = result.actionButton ?? actionButton;
          } else {
            message = result;
          }

          // Dismiss loading toast and show success
          sonnerToast.dismiss(toastId);
          sonnerToast.custom(
            (id) => (
              <ToastComponent
                message={message}
                description={description}
                type="success"
                actionLink={actionLink}
                actionButton={actionButton}
                toastId={id}
              />
            ),
            {
              duration: options.duration ?? 4000,
              unstyled: true,
            },
          );
        })
        .catch((error) => {
          const message =
            typeof options.error === 'function' ? options.error(error) : options.error;

          // Dismiss loading toast and show error
          sonnerToast.dismiss(toastId);
          sonnerToast.custom(
            (id) => (
              <ToastComponent
                message={message}
                description={options.description}
                type="error"
                toastId={id}
              />
            ),
            {
              duration: options.duration ?? 6000,
              unstyled: true,
            },
          );
        });

      return toastId;
    },

    dismiss: (toastId?: string | number) => {
      sonnerToast.dismiss(toastId);
    },
  };

  return toast;
};
