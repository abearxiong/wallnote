import { message } from '@/modules/message';
import { query } from '@/modules/query';
import { create } from 'zustand';
type User = {
  id: string;
  username: string;
  avatar: string;
};
export type Wall = {
  id?: string;
  title?: string;
  description?: string;
  type?: 'wall';
  data?: {
    [key: string]: any;
  };
  link?: string;
  summary?: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
  uid?: string;
  [key: string]: any;
};

interface UserWallStore {
  user?: User;
  setUser: (user: User) => void;
  queryMe: (openOnNoLogin?: boolean) => Promise<void>;
  wallList: Wall[];
  queryWallList: () => Promise<void>;
  logout: () => void;
  saveWall: (data: Wall, opts?: { refresh?: boolean, showMessage?: boolean }) => Promise<any>;
  queryWall: (id: string) => Promise<any>;
  deleteWall: (id: string) => Promise<any>;
}

export const useUserWallStore = create<UserWallStore>((set, get) => ({
  user: undefined,
  setUser: (user: User) => set({ user }),
  queryMe: async (openOnNoLogin = true) => {
    const res = await query.post(
      {
        path: 'user',
        key: 'me',
      },
      {
        afterResponse: !openOnNoLogin ? async (res) => res : undefined,
      },
    );
    console.log('queryMe', res);
    if (res.code === 200) {
      set({ user: res.data });
    }
  },
  wallList: [],
  queryWallList: async () => {
    const res = await query.post({
      path: 'mark',
      key: 'list',
      markType: 'wallnote',
      page: 1,
      pageSize: 10,
    });
    if (res.code === 200) {
      set({ wallList: res.data.list });
    }
  },
  saveWall: async (data: Wall, opts?: { refresh?: boolean, showMessage?: boolean }) => {
    const { queryWallList } = get();
    const res = await query.post({
      path: 'mark',
      key: 'update',
      data,
    });
    if (res.code === 200) {
      // 刷新列表
      opts?.refresh && (await queryWallList());
      opts?.showMessage && message.success('保存成功');
      return res;
    }
    return res;
  },
  queryWall: async (id: string) => {
    const res = await query.post({
      path: 'mark',
      key: 'get',
      id,
    });
    return res;
  },
  deleteWall: async (id: string) => {
    const res = await query.post({
      path: 'mark',
      key: 'delete',
      id,
    });
    return res;
  },
  logout: () => {
    set({ user: undefined });
    localStorage.removeItem('token');
  },
}));
