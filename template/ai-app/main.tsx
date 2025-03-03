import { createRoot, Root } from 'react-dom/client';
import { AiApp } from './AiApp';
import { app, initAIAppRootOrCreate, useContextKey } from '../app';
import { Editor } from '@/pages/editor/index';
import { ExampleApp } from '@/modules/panels/Example';
initAIAppRootOrCreate();

app
  .route({
    path: 'ai',
    key: 'render',
    description: '渲染AI应用',
    run: async (ctx) => {
      const root = initAIAppRootOrCreate();
      console.log('ai render');
      console.log('ai render', root);
      if (!root) {
        return;
      }
      const aiRoot = createRoot(root!);
      // aiRoot.render(<Editor />);
      // aiRoot.render(<AiApp />);
      aiRoot.render(<ExampleApp />);
      useContextKey('aiRoot', () => aiRoot, true);
      ctx.body = 'aiRoot';
    },
  })
  .addTo(app);
