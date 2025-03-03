import { createRoot, Root } from 'react-dom/client';
import { App } from './App.tsx';
import { useContextKey } from '@kevisual/system-lib/dist/web-config';
import './index.css';
import { QueryRouterServer } from '@kevisual/system-lib/dist/router-browser';
import { Editor } from './pages/editor/index.tsx';
import { ExampleApp } from './modules/panels/Example.tsx';

const page = useContextKey('page');
const wallnoteDom = useContextKey('wallnoteDom', () => {
  return document.getElementById('root');
});
const app = useContextKey<QueryRouterServer>('app');
app
  .route({
    path: 'wallnote',
    key: 'getDomId',
    description: '获取墙记的dom',
    run: async (ctx) => {
      console.log('ctx', ctx);
      ctx.body = 'wallnoteDom';
    },
  })
  .addTo(app);

let root: Root | null = null;
app
  .route({
    path: 'wallnote',
    key: 'getWallnoteReactDom',
    description: '获取墙记的react dom',
    run: async (ctx) => {
      const root = await useContextKey('wallReactRoot');
      if (!root) {
        ctx.throw(404, 'wallReactRoot not found');
      }
      ctx.body = 'wallReactRoot';
    },
  })
  .addTo(app);

app
  .route({
    path: 'wallnote',
    key: 'render',
    description: '渲染墙记',
    run: async (ctx) => {
      root = createRoot(wallnoteDom!);
      root.render(<App />);
      useContextKey('wallReactRoot', () => root, true);
      ctx.body = 'wallReactRoot';
    },
  })
  .addTo(app);

page.addPage('/note/:id', 'wallnote');
page.subscribe(
  'wallnote',
  () => {
    root = createRoot(wallnoteDom!);
    root.render(<App />);
  },
  { runImmediately: false },
);

page.addPage('/editor', 'editor');
page.subscribe(
  'editor',
  () => {
    root = createRoot(wallnoteDom!);
    root.render(<Editor />);
  },
  { runImmediately: false },
);

page.addPage('/panels', 'panels');

setTimeout(() => {
  page.subscribe(
    'panels',
    () => {
      root = createRoot(wallnoteDom!);
      root.render(<ExampleApp />);
    },
    { runImmediately: true },
  );
}, 1000);
