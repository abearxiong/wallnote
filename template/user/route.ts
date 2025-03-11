import { app, message } from '../app';

app
  .route({
    path: 'user',
    key: 'login',
  })
  .define(async (ctx) => {
    const { username, password } = ctx.query;
    if (!username || !password) {
      message.error('用户名和密码不能为空');
      ctx.throw(400, '用户名和密码不能为空');
    }
    const res = await fetch('/api/router', {
      method: 'POST',
      body: JSON.stringify({ path: 'user', key: 'login', username, password }),
    }).then((res) => res.json());
    if (res.code === 200) {
      localStorage.setItem('token', res.data.token);
    } else {
      message.error(res.message);
      ctx.throw(400, res.message);
    }
  })
  .addTo(app);

app
  .route({
    path: 'user',
    key: 'logout',
    description: '退出登录',
    metadata: {
      command: 'logout',
    },
  })
  .define(async (ctx) => {
    localStorage.removeItem('token');
    fetch('/api/router?path=user&key=logout', {
      method: 'POST',
    });
    setTimeout(() => {
      window.location.href = '/user/login';
    }, 1000);
  })
  .addTo(app);
