import { create } from 'zustand';
import { XYPosition } from '@xyflow/react';
import { getWallData, setWallData } from '../utils/db';
import { useUserWallStore } from './user-wall';
import { redirectToLogin } from '@/modules/require-to-login';
import { message } from '@/modules/message';

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
  saveNodes: (nodes: NodeData[], opts?: { showMessage?: boolean }) => Promise<void>;
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedNode: NodeData | null;
  setSelectedNode: (node: NodeData | null) => void;
  editValue: string;
  setEditValue: (value: string) => void;
  data?: any;
  setData: (data: any) => void;
  init: (id?: string | null) => Promise<void>;
  id: string | null;
  setId: (id: string | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
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
}
const initialNodes = [
  // { id: '1', type: 'wall', position: { x: 0, y: 0 }, data: { html: '1' } },
  {
    id: '1',
    type: 'wall',
    position: { x: 0, y: 0 },
    data: { html: 'sadfsdaf1 sadfsdaf1 sadfsdaf1 sadfsdaf1 sadfsdaf1 sadfsdaf1 sadfsdaf1 sadfsdaf1', width: 410, height: 212 },
  },
  // { id: '2', type: 'wall', position: { x: 0, y: 100 }, data: { html: '3332' } },
];

export const useWallStore = create<WallState>((set, get) => ({
  nodes: [],
  loading: false,
  setLoading: (loading) => set({ loading }),
  setNodes: (nodes) => {
    set({ nodes });
  },
  saveNodes: async (nodes: NodeData[], opts) => {
    console.log('nodes', nodes, opts, opts?.showMessage ?? true);
    if (!get().id) {
      const covertData = getNodeData(nodes);
      setWallData({ nodes: covertData });
      const showMessage = opts?.showMessage ?? true;
      showMessage && message.success('保存到本地');
    } else {
      const { id } = get();
      const userWallStore = useUserWallStore.getState();
      console.log('saveNodes id', id);
      if (id) {
        const covertData = getNodeData(nodes);
        const res = await userWallStore.saveWall({
          id,
          data: {
            nodes: covertData,
          },
        });
        if (res.code === 200) {
          // console.log('saveNodes res', res);
          message.success('保存成功', {
            closeOnClick: true,
          });
        }
      }
    }
  },
  open: false,
  setOpen: (open) => set({ open }),
  selectedNode: null,
  setSelectedNode: (node) => set({ selectedNode: node }),
  editValue: '',
  setEditValue: (value) => set({ editValue: value }),
  data: null,
  setData: (data) => set({ data }),
  id: null,
  setId: (id) => set({ id }),
  loaded: false,
  init: async (id?: string | null) => {
    // 如果登陆了且如果有id，从服务器获取
    // 没有id，获取缓存
    const hasLogin = localStorage.getItem('token');
    if (hasLogin && id) {
      const res = await useUserWallStore.getState().queryWall(id);
      if (res.code === 200) {
        set({ nodes: res.data?.data?.nodes || [], loaded: true, id, data: res.data });
      } else {
        // message.error('获取失败，请稍后刷新重试');
        set({ loaded: 'error' });
      }
    } else if (!hasLogin && id) {
      // 没有登陆，但是有id，从服务器获取
      // 跳转到登陆页面
      redirectToLogin();
    } else {
      const data = await getWallData();
      set({ nodes: data?.nodes || [], loaded: true });
    }
  },
  toolbarOpen: false,
  setToolbarOpen: (open) => set({ toolbarOpen: open }),
  showFormDialog: false,
  setShowFormDialog: (show) => set({ showFormDialog: show }),
  formDialogData: null,
  setFormDialogData: (data) => set({ formDialogData: data }),
  clear: async () => {
    if (get().id) {
      set({ nodes: initialNodes, id: null, selectedNode: null, editValue: '', data: null });
      await useUserWallStore.getState().saveWall({
        id: get().id!,
        data: {
          nodes: [],
        },
      });
    } else {
      set({ nodes: initialNodes, id: null, selectedNode: null, editValue: '', data: null });
      await setWallData({ nodes: [] });
    }
  },
  exportWall: async (nodes: NodeData[]) => {
    const covertData = getNodeData(nodes);
    setWallData({ nodes: covertData });
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
    set({ nodes: initialNodes, id: null, selectedNode: null, editValue: '', data: null, toolbarOpen: false, loaded: false });
  },
}));
