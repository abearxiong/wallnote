import { app } from '../app';

app
  .route({
    path: 'wallnote',
    key: 'list',
    validator: {
      pagiantion: {
        type: 'object',
        properties: {
          page: {
            type: 'number',
          },
        },
      },
    },
    run: async (ctx) => {
      const { pagiantion } = ctx.validator.pagiantion;
      const { page } = pagiantion;
      const { data } = await ctx.query.get('/wallnote/list', {
        page,
      });
    },
  })
  .addTo(app);
