import { useContextKey } from '@kevisual/system-lib/dist/web-config';
import { QueryRouterServer } from '@kevisual/system-lib/dist/router-browser';

export const app = useContextKey<QueryRouterServer>('app');
