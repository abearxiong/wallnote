import { useContextKey } from '@kevisual/system-lib/dist/web-config';
import { EventEmitter } from 'eventemitter3';
export const emitter = useContextKey<EventEmitter>('emitter', () => {
  return new EventEmitter();
});
