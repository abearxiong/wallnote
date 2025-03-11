import { PanelTopOpen, PanelTopClose, Save, Download, Upload, User, Trash, Plus, BrickWall } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useWallStore } from '../../store/wall';
import clsx from 'clsx';
import { useUserWallStore } from '../../store/user-wall';
import { redirectToLogin } from '@/modules/require-to-login';
import { useStore } from '@xyflow/react';
import { message } from '@/modules/message';
import { ClickAwayListener } from '@mui/material';
export const ToolbarItem = ({
  children,
  showBorder = true,
  onClick,
  className,
}: {
  children: React.ReactNode;
  showBorder?: boolean;
  onClick?: () => any;
  className?: string;
}) => {
  return (
    <div onClick={onClick} className={clsx('flex items-center w-full gap-4 p-2 border-b border-gray-300 cursor-pointer', showBorder && 'border-b', className)}>
      {children}
    </div>
  );
};
export type MenuItem = {
  label: string;
  key: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  onClick: () => any;
};
// 空白处点击，当不包函toolbar时候，关闭toolbar
export const useBlankClick = () => {
  const { setToolbarOpen } = useWallStore(
    useShallow((state) => {
      return {
        setToolbarOpen: state.setToolbarOpen,
      };
    }),
  );
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // 点击的内容，closest('.toolbar')
      const target = e.target as HTMLElement;
      const toolbar = target.closest('.toolbar'); // 往上找，找到toolbar为止
      console.log('toolbar', target, toolbar);
      // if (!toolbar) {
      //   setToolbarOpen(false);
      // }
    };
    console.log('add event');
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);
};
export const ToolbarContent = ({ open }) => {
  if (!open) {
    return null;
  }
  const wallStore = useWallStore(useShallow((state) => state));
  const userWallStore = useUserWallStore(useShallow((state) => state));
  const store = useStore((state) => state);
  const hasLogin = !!userWallStore.user;

  const menuList: MenuItem[] = [
    {
      label: '导出',
      key: 'export',
      icon: <Download />,
      onClick: () => {
        wallStore.exportWall(store.nodes);
      },
    },
    {
      label: '导入',
      key: 'import',
      icon: <Upload />,
      children: (
        <>
          <div>
            <Upload />
          </div>
          <div>导入</div>
          <input
            type='file'
            id='import-file'
            accept='.json'
            style={{ display: 'none' }}
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = async (e) => {
                  const data = e.target?.result;
                  const json = JSON.parse(data as string);
                  const keys = ['id', 'type', 'position', 'data'];
                  if (Array.isArray(json) && json.every((item) => keys.every((key) => item[key]))) {
                    const nodes = store.nodes;
                    const newNodes = json.filter((item) => {
                      return !nodes.find((node) => node.id === item.id);
                    });
                    const _nodes = [...nodes, ...newNodes];
                    store.setNodes(_nodes);
                    // window.location.reload();
                    wallStore.setNodes(_nodes);
                    await wallStore.saveNodes(_nodes);
                    message.success('导入成功');
                  } else {
                    message.error('文件格式错误');
                  }
                };
                reader.readAsText(file);
              }
            }}
          />
        </>
      ),
      onClick: () => {
        const input = document.querySelector('#import-file')! as HTMLInputElement;
        if (input) {
          input.click();
        } else {
          message.error('请选择文件');
        }
      },
    },
  ];
  menuList.push({
    label: '删除',
    key: 'delete',
    icon: <Trash />,
    onClick: async () => {
      const res = await userWallStore.deleteWall(wallStore.id!);
      if (res.code === 200) {
        // navigate('/');
      }
    },
  });

  menuList.push({
    label: '编辑信息',
    key: 'saveToAccount',
    icon: <Save />,
    onClick: () => {
      wallStore.setShowFormDialog(true);
      const data = wallStore.data;
      wallStore.setFormDialogData({
        title: data?.title,
        description: data?.description,
        tags: data?.tags,
        summary: data?.summary,
      });
    },
  });
  menuList.push({
    label: '退出  ',
    key: 'logout',
    icon: <User />,
    onClick: () => {
      userWallStore.logout();
    },
  });
  return (
    <ClickAwayListener onClickAway={() => wallStore.setToolbarOpen(false)}>
      <div className=' flex flex-col items-center w-[200px] bg-white border border-gray-300 rounded-md absolute top-0 left-8'>
        {menuList.map((item) => (
          <ToolbarItem
            key={item.key}
            className={item.className}
            onClick={() => {
              item.onClick?.();
              if (item.key !== 'import') {
                wallStore.setToolbarOpen(false);
              }
            }}>
            {item.children ? (
              <>{item.children}</>
            ) : (
              <>
                <div>{item.icon}</div>
                <div>{item.label}</div>
              </>
            )}
          </ToolbarItem>
        ))}
        <div className='text-xs p-1 text-gray-500 italic'>{wallStore.id ? 'id:' + wallStore.id : '临时编辑，资源缓存在本地'}</div>
        {hasLogin && <div className='text-xs p-1 -mt-1 text-gray-500 w-full text-right mr-2'>用户: {userWallStore.user?.username}</div>}
      </div>
    </ClickAwayListener>
  );
};
export const Toolbar = () => {
  const wallStore = useWallStore(useShallow((state) => state));
  const { toolbarOpen, setToolbarOpen } = wallStore;

  return (
    <div className='toolbar flex items-center gap-2 relative'>
      <div className='p-2 cursor-pointer' onClick={() => setToolbarOpen(!toolbarOpen)}>
        <PanelTopClose className={clsx('w-4 h-4', toolbarOpen && 'hidden')} />
        <PanelTopOpen className={clsx('w-4 h-4', !toolbarOpen && 'hidden')} />
      </div>
      <ToolbarContent open={toolbarOpen} />
    </div>
  );
};
