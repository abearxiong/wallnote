import { useContextKey } from '@kevisual/system-lib/dist/web-config';
import { QueryRouterServer } from '@kevisual/system-lib/dist/router-browser';
import { usePanelStore } from './store';
import { createEditorWindow } from './store/create/create-editor-window';
export const app = useContextKey<QueryRouterServer>('app');

app
  .route({
    path: 'panels',
    key: 'add-editor-window',
  })
  .define(async (ctx) => {
    const { data } = ctx.query;
    const state = usePanelStore.getState();

    const newWindow = createEditorWindow(data.pageId, data.nodeData, {
      id: data.nodeData.id,
      title: data.nodeData.title,
      show: true,
      position: {
        x: 0,
        y: 0,
        width: 600,
        height: 400,
        zIndex: 1000,
      },
    });
    state.setEditorWindow(newWindow.windowData);
  })
  .addTo(app);

app
  .route({
    path: 'panels',
    key: 'close-editor-window',
  })
  .define(async (ctx) => {
    const { data } = ctx.query;
    const state = usePanelStore.getState();
    state.closeEditorWindow(data.id);
  })
  .addTo(app);
