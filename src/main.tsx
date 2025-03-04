import { page, app } from './routes';

page.addPage('/', 'wallnote');

setTimeout(() => {
  page.subscribe(
    'wallnote',
    () => {
      app.call({
        path: 'wallnote',
        key: 'render',
      });
    },
    { runImmediately: false },
  );
}, 1000);
