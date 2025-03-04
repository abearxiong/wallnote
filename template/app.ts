import { QueryAI } from '@kevisual/query/query-ai';
import { MyCache } from '@kevisual/cache';
import { useContextKey } from '@kevisual/system-lib/dist/web-config';
import { QueryRouterServer } from '@kevisual/system-lib/dist/router-browser';
import { QueryClient } from '@kevisual/system-lib/dist/query-browser';
import { Page } from '@kevisual/system-lib/dist/web-page';
import { BaseLoad } from '@kevisual/system-lib/dist/load';
import { Message } from '@kevisual/system-ui/dist/message';
export { useContextKey };
export const message = useContextKey<Message>('message', () => {
  return new Message();
});
export const load = useContextKey<BaseLoad>('load', () => {
  return new BaseLoad();
});
export const app = useContextKey<QueryRouterServer>('app');
export const page = useContextKey<Page>('page');
export const query = useContextKey<QueryClient>('query', () => {
  return new QueryClient({
    io: true,
  });
});
export const workCache = useContextKey<MyCache>('workCache', () => {
  return new MyCache('work');
});

export const queryAI = useContextKey<QueryAI>('queryAI', () => {
  return new QueryAI();
});

export const rootEl = document.getElementById('root') as HTMLElement;
export const initAIAppRootOrCreate = () => {
  const root = document.getElementById('ai-root');
  if (!root) {
    const root = document.createElement('div');
    root.id = 'ai-root';
    document.body.appendChild(root);
  }
  return root;
};
