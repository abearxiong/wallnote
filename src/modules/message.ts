import { toast, ToastOptions } from 'react-toastify';

export const message = {
  error: (message: string, options?: ToastOptions) => {
    toast.error(message, options);
  },
  success: (message: string, options?: ToastOptions) => {
    toast.success(message, {
      position: 'top-left',
      autoClose: 1000,
      ...options,
    });
  },
  warning: (message: string, options?: ToastOptions) => {
    toast.warning(message, options);
  },
  info: (message: string, options?: ToastOptions) => {
    toast.info(message, options);
  },
  default: (message: string, options?: ToastOptions) => {
    toast(message, options);
  },
};
