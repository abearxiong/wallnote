import { createRoot } from 'react-dom/client';
import { app, initAIAppRootOrCreate, useContextKey } from '../app';
import { Panels } from '@/modules/panels/index';
initAIAppRootOrCreate();

app
  .route({
    path: 'ai',
    key: 'render',
    description: '渲染AI应用',
    run: async (ctx) => {
      const root = initAIAppRootOrCreate();
      if (!root) {
        return;
      }
      const aiRoot = createRoot(root!);
      aiRoot.render(<Panels />);
      useContextKey('aiRoot', () => aiRoot, true);
      ctx.body = 'aiRoot';
    },
  })
  .addTo(app);
