import { create } from 'zustand';
import { WindowData } from '../types';
import { MyCache } from '@kevisual/cache';
import { query } from '@/modules/query';
import { toast } from 'react-toastify';
import { getDocumentWidthAndHeight } from '../utils/document-width';
import { produce } from 'immer';

interface PanelStore {
  data?: PanelData;
  setData: (data: PanelData) => void;
  init?: (id?: string) => Promise<any>;
  id: string;
  setId: (id: string) => void;
  toggleAICommand: () => void;
}
interface PanelData {
  /**
   * 窗口列表
   */
  windows: WindowData[];
  /**
   * 是否显示任务栏
   */
  showTaskbar: boolean;
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
    const cache = new MyCache<PanelData>(id || 'workspace');
    if (id) {
      // id存在，则获取本地和获取远程，进行对比，如果需要更新，则更新
      if (cache.data) {
        const updatedAt = cache.updatedAt;
        const res = await query.post({ path: 'workspace', key: 'env', id, updatedAt });
        if (res.code === 200) {
          const newData = res.data;
          if (newData) {
            cache.setData(newData);
            set({
              data: newData,
              id: id,
            });
          } else {
            set({ data: cache.data, id: id });
          }
        } else {
          toast.error('获取环境失败');
          return;
        }
      } else {
        const res = await query.post({ path: 'workspace', key: 'env', id });
        if (res.code === 200) {
          const newData = res.data;
          if (newData) {
            cache.setData(newData);
            set({
              data: newData,
              id: id,
            });
          }
        }
      }
    } else if (cache.data) {
      set({
        data: cache.data,
      });
    } else {
      set({
        data: { windows: [], showTaskbar: true },
      });
    }
  },
  toggleAICommand: () => {
    const { data } = get();
    if (!data) {
      return;
    }
    const has = data.windows.find((w) => w.id === '__ai__');
    if (has) {
      data.windows = data.windows.map((w) => {
        if (w.id === '__ai__') {
          return { ...w, show: !w.show };
        }
        return w;
      });
    } else {
      const { width, height } = getDocumentWidthAndHeight();
      data.windows.push({
        id: '__ai__',
        title: 'AI Command',
        type: 'commandƒ',
        position: {
          x: 100,
          y: height - 200,
          width: width - 200,
          height: 200,
          zIndex: 1000,
        },
        resizeHandles: ['se', 'sw', 'ne', 'nw', 's', 'w', 'n', 'e'],
        show: true,
      });
    }
    set({ data: { ...data, windows: data.windows } });
    console.log('data', data);
  },
}));
