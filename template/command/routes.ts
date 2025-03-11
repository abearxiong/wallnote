import TurndownService from 'turndown';
import { app, message } from '../app';

// 命令规则
// 1. 命令以 ! 开头
// 2. 命令和内容之间用空格隔开
// 3. 多余的地方不要有!,如果有，使用\! 代替
//
//
// test命令 !a 显示内容 !b 但是会计法 !c 飒短发 !fdsaf s !kong !d d!!的身份 ! 是的! !ene
// 7个
export function parseCommands(text: string) {
  //文本以\!的内容都去掉
  text = text.replace(/\\!/g, '__REPLACE__RETURN__');
  const result: { command: string; content: string }[] = [];
  const parts = text.split('!');

  for (let i = 1; i < parts.length; i++) {
    const part = parts[i].trim();
    if (part.length === 0) continue; // 忽略空的部分

    const spaceIndex = part.indexOf(' ');
    const command = '!' + (spaceIndex === -1 ? part : part.slice(0, spaceIndex));
    let content = spaceIndex === -1 ? '' : part.slice(spaceIndex + 1).trim();
    if (content.includes('__REPLACE__RETURN__')) {
      content = content.replace('__REPLACE__RETURN__', '!');
    }
    result.push({ command, content });
  }

  return result;
}

app
  .route({
    path: 'command',
    key: 'handle',
    description: '处理命令',
  })
  .define(async (ctx) => {
    const { html } = ctx.query;
    // 解析 文本中的 !command 命令
    // 1. 当没有命令的时候是保存文本
    // 2. 当有命令的时候，查询命令，执行
    //    - 当命令不存在，直接返回提示
    //    - 当命令存在，执行命令
    const turndown = new TurndownService();
    const markdown = turndown.turndown(html);
    const commands = parseCommands(markdown);

    if (commands.length === 0) {
      ctx.body = markdown;
      const res = await app.call({ path: 'note', key: 'save', payload: { html } });
      if (res.code !== 200) {
        message.error(res.message || '保存失败');
        ctx.throw(400, res.message || '保存失败');
      }
      return;
    }
    console.log('md', markdown);
    console.log('commands', commands, commands.length);
    const res = await app.call({ path: 'command', key: 'list', payload: { commands } });
  })
  .addTo(app);

app
  .route({
    path: 'command',
    key: 'list',
    description: '命令列表',
    metadata: {
      command: 'command-list',
      prompt: '把当前我的数据中，所有命令列表返回',
    },
    validator: {
      commands: {
        type: 'any',
        required: false,
      },
    },
  })
  .define(async (ctx) => {
    const { commands } = ctx.query;
    const getRouteInfo = (route: any) => {
      return {
        path: route.path,
        key: route.key,
        description: route.description,
        metadata: route.metadata,
        validator: route.validator,
      };
    };
    if (Array.isArray(commands) && commands.length > 0) {
      const routes = ctx.queryRouter.routes;
      const commandRoutes = commands.map((command) => {
        const route = routes.find((route) => route.metadata?.command === command.command);
        if (!route) {
          message.error(`命令 ${command.command} 不存在`);
          ctx.throw(400, `命令 ${command.command} 不存在`);
        }
        return {
          command,
          route: getRouteInfo(route),
        };
      });
      ctx.body = commandRoutes;
    } else {
      ctx.body = ctx.queryRouter.routes
        .map((route) => ({
          command: route.metadata?.command,
          route: getRouteInfo(route),
        }))
        .filter((item) => item.command);
    }
  })
  .addTo(app);

setTimeout(async () => {
  const res = await app.call({ path: 'command', key: 'list' });
  console.log('list', res.body);
}, 2000);
