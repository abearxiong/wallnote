import { create, StateCreator, StoreApi, UseBoundStore } from 'zustand';
import { XYPosition } from '@xyflow/react';
import { getCacheWallData, setCacheWallData } from '../utils/db';
import { useUserWallStore } from './user-wall';
import { redirectToLogin } from '@/modules/require-to-login';
import { message } from '@/modules/message';
import { DOCS_NODE } from '../docs';
import { useContextKey } from '@kevisual/system-lib/dist/web-config';

type NodeData<T = { [key: string]: any }> = {
  id: string;
  position: XYPosition;
  data: T;
  type?: string; // wall
};
export const getNodeData = (nodes: NodeData[]) => {
  return nodes.map((node) => ({
    id: node.id,
    position: node.position,
    data: node.data,
    type: node.type,
  }));
};

interface WallState {
  // 只做传递
  nodes: NodeData[];
  setNodes: (nodes: NodeData[]) => void;
  saveDataNode: (nodes: NodeData[]) => Promise<void>;
  saveNodes: (nodes: NodeData[], opts?: { showMessage?: boolean }) => Promise<void>;
  checkAndOpen: (open?: boolean, data?: any) => void;
  data?: any;
  setData: (data: any) => void;
  init: (id?: string) => Promise<void>;
  id: string | null;
  setId: (id: string | null) => void;
  loaded: boolean | 'error';
  toolbarOpen: boolean;
  setToolbarOpen: (open: boolean) => void;
  showFormDialog: boolean;
  setShowFormDialog: (show: boolean) => void;
  formDialogData: any;
  setFormDialogData: (data: any) => void;
  clear: () => Promise<void>;
  exportWall: (nodes: NodeData[]) => Promise<void>;
  clearQueryWall: () => Promise<void>;
  clearId: () => Promise<void>;
  mouseSelect: boolean;
  setMouseSelect: (mouseSelect: boolean) => void;
  getNodeById: (id: string) => Promise<NodeData | null>;
  saveNodeById: (id: string, data: any) => Promise<void>;
}
export class WallStore {
  private storeMap: Map<string, UseBoundStore<StoreApi<WallState>>> = new Map();
  constructor() {
    this.crateStoreById('today');
  }
  crateStoreById(id: string) {
    const store = create<WallState>((set, get) => ({
      nodes: [],
      setNodes: (nodes) => {
        set({ nodes });
      },
      saveDataNode: async (nodes: NodeData[]) => {
        const id = get().id;
        if (!id) {
          message.error('没有id');
          return;
        }
        const covertData = getNodeData(nodes);
        const nodeOperateList = covertData.map((item) => ({
          node: item,
        }));
        const res = await useUserWallStore.getState().saveDataNodes(id, nodeOperateList);

        if (res.code === 200) {
          message.success('保存成功');
        } else {
          message.error('保存失败');
        }
      },
      saveNodes: async (nodes: NodeData[], opts) => {
        const showMessage = opts?.showMessage ?? true;
        const id = get().id;
        if (!id) {
          message.error('没有id');
          return;
        }
        const covertData = getNodeData(nodes);
        const userWallStore = useUserWallStore.getState();
        const res = await userWallStore.saveWall({
          id,
          data: {
            nodes: covertData,
          },
        });
        if (res.code === 200) {
          // console.log('saveNodes res', res);
          showMessage &&
            message.success('保存成功', {
              closeOnClick: true,
            });
          const markRes = res.data;
          setCacheWallData(markRes, markRes?.id);
        }
      },
      checkAndOpen: (open, data) => {
        //
      },
      data: null,
      setData: (data) => set({ data }),
      id: null,
      setId: (id) => set({ id }),
      loaded: false,
      init: async (id?: string) => {
        // 如果登陆了且如果有id，从服务器获取
        // 没有id，获取缓存
        const hasLogin = localStorage.getItem('token');
        const checkVersion = async (): Promise<{ id: string; version: number } | null> => {
          const res = await useUserWallStore.getState().queryWallVersion(id);
          if (res.code === 200) {
            const data = res.data;
            return data;
          } else {
            message.error('获取失败，请稍后刷新重试');
            return null;
          }
        };
        const getNew = async () => {
          const res = await useUserWallStore.getState().queryWall(id);
          if (res.code === 200) {
            const data = res.data;
            set({ nodes: data?.data?.nodes || [], loaded: true, id: data?.id, data });
            setCacheWallData(data, data?.id);
          }
        };
        if (hasLogin) {
          const cvData = await checkVersion();
          if (cvData) {
            const id = cvData?.id;
            const cacheData = await getCacheWallData(id);
            if (cacheData) {
              const version = cacheData?.version;
              if (version === cvData?.version) {
                set({ nodes: cacheData?.data?.nodes || [], loaded: true, id, data: cacheData });
              } else {
                getNew();
              }
            } else {
              getNew();
            }
          }
        } else {
          // 跳转到登陆页面
          redirectToLogin();
        }
      },
      toolbarOpen: false,
      setToolbarOpen: (open) => set({ toolbarOpen: open }),
      showFormDialog: false,
      setShowFormDialog: (show) => set({ showFormDialog: show }),
      formDialogData: null,
      setFormDialogData: (data) => set({ formDialogData: data }),
      clear: async () => {
        // if (get().id) {
        //   set({ nodes: [], data: null });
        //   await useUserWallStore.getState().saveWall({
        //     id: get().id!,
        //     data: {
        //       nodes: [],
        //     },
        //   });
        // } else {
        //   set({ nodes: [], id: null, data: null });
        //   await setCacheWallData({ nodes: [] });
        // }
      },
      clearId: async () => {
        set({ id: null, data: null });
      },

      exportWall: async (nodes: NodeData[]) => {
        const covertData = getNodeData(nodes);
        const mark = get().data;
        setCacheWallData({ ...mark, data: { ...mark.data, nodes: covertData } }, mark?.id);
        // 导出为json
        const json = JSON.stringify(covertData);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'wall.json';
        a.click();
      },
      clearQueryWall: async () => {
        set({ nodes: [], id: null, data: null, toolbarOpen: false, loaded: false });
      },
      mouseSelect: true,
      setMouseSelect: (mouseSelect) => set({ mouseSelect }),
      getNodeById: async (id: string) => {
        const data = await getCacheWallData(get().id!);
        const nodes = data?.data?.nodes || [];
        return nodes.find((node) => node.id === id);
      },
      saveNodeById: async (id: string, data: any) => {
        let node = await get().getNodeById(id);
        if (node) {
          node.data = {
            ...node.data,
            ...data,
            updatedAt: new Date().getTime(),
          };
          const newNodes = get().nodes.map((item) => {
            if (item.id === id) {
              return node;
            }
            return item;
          });
          set({
            nodes: newNodes,
          });
          get().saveNodes(newNodes, { showMessage: false });
        }
      },
    }));
    this.storeMap.set(id, store);
    return store;
  }
  getStoreById(id: string) {
    const store = this.storeMap.get(id);
    if (!store) {
      return this.crateStoreById(id);
    }
    return store;
  }
}
// export const useWallStore =
const wallStore = useContextKey('wallStore', () => new WallStore());
export const useWallStore = wallStore.getStoreById('today');
