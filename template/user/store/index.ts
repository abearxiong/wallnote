import { message } from '../../app';
import { query } from '../../app';
import { createStore } from 'zustand/vanilla';
type User = {
  id: string;
  username?: string;
  nickname?: string;
  avatar: string;
};

interface UserWallStore {
  user?: User;
  setUser: (user: User) => void;
  /**
   * 查询用户信息，用户没有登陆，则打开登陆页面
   * @param openOnNoLogin
   * @returns
   */
  queryMe: (openOnNoLogin?: boolean) => Promise<void>;
  logout: () => void;
  isLogin: () => boolean;
}

export const useUserWallStore = createStore<UserWallStore>((set, get) => ({
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

  logout: () => {
    set({ user: undefined });
    localStorage.removeItem('token');
  },
  isLogin: () => {
    return !!get().user;
  },
}));
