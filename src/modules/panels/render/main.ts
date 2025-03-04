import { useContextKey } from '@kevisual/system-lib/dist/web-config';
import { emitter } from '../modules/index';
import { ManagerRender } from './manager/manager';
export { emitter };
export { useContextKey };

export const managerRender = useContextKey<ManagerRender>('managerRender', () => {
  return new ManagerRender();
});
