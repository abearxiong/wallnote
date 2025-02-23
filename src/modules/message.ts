import { toast, ToastOptions } from 'react-toastify';

export const message = {
  error: (message: string, options?: ToastOptions) => {
    toast.error(message, options);
  },
  success: (message: string, options?: ToastOptions) => {
    return toast.success(message, {
      position: 'top-left',
      autoClose: 1000,
      ...options,
    });
  },
  warning: (message: string, options?: ToastOptions) => {
    return toast.warning(message, options);
  },
  info: (message: string, options?: ToastOptions) => {
    return toast.info(message, options);
  },
  default: (message: string, options?: ToastOptions) => {
    return toast(message, options);
  },
  loading: (message: string, options?: ToastOptions) => {
    return toast(message, {
      position: 'top-left',
      autoClose: false,
      ...options,
    });
  },
  close: (id: number | string) => {
    toast.dismiss(id);
  },
};
