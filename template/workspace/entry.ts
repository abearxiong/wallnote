import { app, page } from '../app';
import { message } from '@kevisual/system-ui/dist/message';
let isRender = false;
app
  .route({
    path: 'workspace',
    key: 'enter',
    run: async (ctx) => {
      // 第一次进入页面，获取用户信息，如果没有登陆，则去登陆，TODO
      // 只根据id来判断工作区。
      const url = new URL(location.href);
      const isWorksapce = url.pathname.startsWith('/workspace');
      if (!isWorksapce) {
        message.error('请先进入工作区');
        return;
      }
      console.log('workspace enter');
      if (!isRender) {
        app.call({
          path: 'wallnote',
          key: 'render',
        });
        isRender = true;
      }
      ctx.body = '';
    },
  })
  .addTo(app);

