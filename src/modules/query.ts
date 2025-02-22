import { QueryClient } from '@kevisual/query';
import { modal } from './require-to-login';
import { message } from './message';

export const query = new QueryClient();

query.afterResponse = async (res) => {
  if (res.code === 401) {
    modal.setOpen(true);
  }
  if (res.code === 403) {
    if (!res?.message) {
      message.error('Unauthorized');
    }
  }
  return res;
};
