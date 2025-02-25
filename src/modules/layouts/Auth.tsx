import { useEffect } from 'react';
import { useUserWallStore } from '../../pages/wall/store/user-wall';
import { useShallow } from 'zustand/react/shallow';
import { Outlet } from 'react-router-dom';

/**
 *
 * @param children
 * @param auth 是否必须要登陆
 * @returns
 */
export const Auth = ({ children, auth = true }: { children?: React.ReactNode; auth?: boolean; canNoAuth?: boolean; isOutlet?: boolean }) => {
  const userStore = useUserWallStore(
    useShallow((state) => {
      return { user: state.user, queryMe: state.queryMe };
    }),
  );
  useEffect(() => {
    if (!userStore.user) {
      userStore.queryMe(auth);
    }
  }, []);
  if (children) {
    if (auth) {
      return <>{userStore.user && children}</>;
    }
    return <>{children}</>;
  }
  if (auth) {
    return <>{userStore.user && <Outlet />}</>;
  }
  return <>{<Outlet />}</>;
};
