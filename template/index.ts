import { app, page, load } from './app';
import '../src/routes';
import './ai-app/main';
import './tailwind.css';
import './workspace/entry';
import './routes';

page.addPage('/', 'workspace');

const runLoad = () => {
  load.load(
    () => {
      console.log('runLoad');
      // @TODO 这里需要优化，不能每次都去调用
      page.subscribe(
        'workspace',
        async () => {
          await app.call({
            path: 'workspace',
            key: 'enter',
          });
          setTimeout(() => {
            app.call({
              path: 'ai',
              key: 'render',
            });
          }, 1000);
        },
        { runImmediately: true },
      );
    },
    {
      key: 'workspaceRoute',
      isReRun: true,
      checkSuccess: () => {
        return page.pageModule.has('workspace');
      },
    },
  );
};

runLoad()