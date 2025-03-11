import { create } from 'zustand';
import { WindowData } from '../types';
import { MyCache } from '@kevisual/cache';
import { query } from '@/modules/query';
import { toast } from 'react-toastify';
import { getDocumentWidthAndHeight } from '../utils/document-width';
import { produce } from 'immer';
import { createEditorWindow } from './create/create-editor-window';
import { createDemoEditorWindow } from '../demo/DemoWindows';

interface PanelStore {
  data?: PanelData;
  setData: (data: PanelData) => void;
  init?: (id?: string) => Promise<any>;
  id: string;
  setId: (id: string) => void;
  toggleAICommand: (windows: WindowData[]) => WindowData[];
  saveWindows: (windows: WindowData[]) => void;
  setEditorWindow: (windowData: WindowData) => void;
  closeEditorWindow: (id: string) => void;
}
interface PanelData {
  /**
   * 窗口列表
   */
  windows: WindowData[];
  /**
   * 是否显示任务栏
   */
  showTaskbar?: boolean;
}

export const usePanelStore = create<PanelStore>((set, get) => ({
  id: '',
  setId: (id: string) => set({ id }),
  data: undefined,
  setData: (data: PanelData) => set({ data }),
  initNewEnv: async (id?: string) => {
    const cache = new MyCache<PanelData>(id || 'panel');
    const data = await cache.getData();
    set({
      data: data,
    });
  },

  init: async (id?: string) => {
    // const cache = new MyCache<PanelData>(id || 'workspace');
    // if (id) {
    //   // id存在，则获取本地和获取远程，进行对比，如果需要更新，则更新
    //   if (cache.data) {
    //     const updatedAt = cache.updatedAt;
    //     const res = await query.post({ path: 'workspace', key: 'env', id, updatedAt });
    //     if (res.code === 200) {
    //       const newData = res.data;
    //       if (newData) {
    //         cache.setData(newData);
    //         set({
    //           data: newData,
    //           id: id,
    //         });
    //       } else {
    //         set({ data: cache.data, id: id });
    //       }
    //     } else {
    //       toast.error('获取环境失败');
    //       return;
    //     }
    //   } else {
    //     const res = await query.post({ path: 'workspace', key: 'env', id });
    //     if (res.code === 200) {
    //       const newData = res.data;
    //       if (newData) {
    //         cache.setData(newData);
    //         set({
    //           data: newData,
    //           id: id,
    //         });
    //       }
    //     }
    //   }
    // } else if (cache.data) {
    //   set({
    //     data: cache.data,
    //   });
    // } else {
    //   set({
    //     data: { windows: [], showTaskbar: true },
    //   });
    // }

    set({
      data: {
        // windows: [e.windowData],
        windows: [],
        showTaskbar: true,
      },
    });
  },
  setEditorWindow: (windowData: WindowData) => {
    const { data } = get();
    if (!data) {
      return;
    }
    const has = data.windows.find((w) => w.id === windowData.id);
    if (has) {
      data.windows = data.windows.map((w) => {
        if (w.id === windowData.id) {
          return windowData;
        }
        return w;
      });
    } else {
      data.windows.push(windowData);
    }
    console.log('data', data);
    set({ data: { ...data, windows: data.windows } });
  },
  toggleAICommand: (windows: WindowData[]) => {
    // const { data } = get();
    // if (!data) {
    //   return;
    // }
    const data = { windows };
    const has = data.windows.find((w) => w.id === '__ai__');
    if (has) {
      data.windows = data.windows.map((w) => {
        if (w.id === '__ai__') {
          console.log('w', w.isMinimized, w.show);
          if (w.isMinimized || !w.show) {
            return { ...w, show: true, isMinimized: false };
          }
          return { ...w, show: !w.show, isMinimized: false };
        }
        return w;
      });
    } else {
      const { width, height } = getDocumentWidthAndHeight();
      data.windows.push({
        id: '__ai__',
        title: '🤖 AI Command',
        type: 'command',
        showTitle: true,
        position: {
          x: 100,
          y: height - 200 - 40,
          width: width - 200,
          height: 200,
          zIndex: 1000,
        },
        resizeHandles: ['se', 'sw', 'ne', 'nw', 's', 'w', 'n', 'e'],
        show: true,
        render: {
          command: {
            path: 'editor',
            key: 'render',
            payload: {
              id: '__ai__',
            },
          },
        },
      });
    }
    // set({ data: { ...data, windows: data.windows } });
    console.log('data', data);
    return data.windows;
  },
  saveWindows: (windows: WindowData[]) => {
    set({ data: { ...get().data, windows } });
  },
  closeEditorWindow: (id: string) => {
    const { data } = get();
    if (!data) {
      return;
    }
    data.windows = data.windows.filter((w) => w.id !== id);
    set({ data: { ...data, windows: data.windows } });
  },
}));

// const e = createEditorWindow(
//   '123',
//   {
//     id: '123',
//     title: '123',
//     type: 'editor',
//     position: { x: 0, y: 0, width: 100, height: 100, zIndex: 1000 },
//   },
//   createDemoEditorWindow({
//     id: '123',
//     title: '123',
//     type: 'editor',
//     position: { x: 0, y: 0, width: 100, height: 100, zIndex: 1000 },
//   }),
// );

// console.log('e', e);
