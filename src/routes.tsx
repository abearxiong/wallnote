import { createRoot } from 'react-dom/client';
import { App } from './App.tsx';
import { useContextKey } from '@kevisual/system-lib/dist/web-config';
import './index.css';
import { QueryRouterServer } from '@kevisual/system-lib/dist/router-browser';
import { NodeTextEditor } from './pages/editor/NodeTextEditor.tsx';
import { AiEditor } from './pages/editor/index.tsx';
import { Panels } from './modules/panels/index.tsx';
import { Page } from '@kevisual/system-lib/dist/web-page';

import './modules/panels/routes.ts';

export const page = useContextKey<Page>('page');
export const app = useContextKey<QueryRouterServer>('app');

app
  .route({
    path: 'wallnote',
    key: 'render',
  })
  .define(async (ctx) => {
    const rootEl = document.getElementById('root') as HTMLElement;
    const root = createRoot(rootEl);
    useContextKey('wallnoteRoot', () => root, true);
    root.render(<App />);
  })
  .addTo(app);

app
  .route({
    path: 'wallnote',
    key: 'lib',
    description: '获取编辑器',
  })
  .define(async (ctx) => {
    ctx.body = { Panels };
  })
  .addTo(app);

app
  .route({
    path: 'editor',
    key: 'nodeRender',
    description: '获取编辑器',
  })
  .define(async (ctx) => {
    ctx.body = { lib: NodeTextEditor, type: 'react', Panels };
  })
  .addTo(app);

app
  .route({
    path: 'editor',
    key: 'render',
    description: '获取编辑器',
  })
  .define(async (ctx) => {
    ctx.body = { lib: AiEditor, type: 'react', Panels };
  })
  .addTo(app);
app
  .route({
    path: 'editor',
    key: 'render2',
    description: '获取编辑器',
  })
  .define(async (ctx) => {
    class HtmlRender {
      render({ renderRoot, data }: any) {
        const newDivStr = `<div id="${data.id}">${data.title}</div>`;
        const newDiv = document.createElement('div');
        newDiv.innerHTML = newDivStr;
        renderRoot.appendChild(newDiv);
      }
      destroy() {
        // 什么也不做
      }
    }
    ctx.body = {
      lib: HtmlRender,
      type: 'html',
    };
  })
  .addTo(app);
