import { useWallStore } from '../store/wall'; // 确保导入正确的路径
import clsx from 'clsx';
import { X } from 'lucide-react'; // 导入 Close 图标
import { Editor } from '@/pages/editor';
import { useEffect, useState } from 'react';
import { useStore, useStoreApi } from '@xyflow/react';
import { BlankNoteText } from '../constants';
import { message } from '@/modules/message';
import { useShallow } from 'zustand/react/shallow';
import { isMac } from '../utils/is-mac';
const Drawer = () => {
  const { open, setOpen, selectedNode, setSelectedNode, editValue, setEditValue, hasEdited, setHasEdited } = useWallStore(
    useShallow((state) => ({
      open: state.open,
      setOpen: state.setOpen,
      selectedNode: state.selectedNode,
      setSelectedNode: state.setSelectedNode,
      editValue: state.editValue,
      setEditValue: state.setEditValue,
      hasEdited: state.hasEdited,
      setHasEdited: state.setHasEdited,
    })),
  );
  const store = useStore((state) => state);
  const storeApi = useStoreApi();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (open && selectedNode) {
      setEditValue(selectedNode?.data.html, true);
    }
  }, [open, selectedNode]);
  useEffect(() => {
    setMounted(true);
    return () => {
      setOpen(false);
      setHasEdited(false);
      setSelectedNode(null);
    };
  }, []);
  const listener = async (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setOpen(false);
    }

    const systemKey = e.metaKey || e.ctrlKey;

    // mac command+s windows ctrl+s
    if (systemKey && e.key === 's') {
      onSave();
      e.preventDefault();
      e.stopPropagation();
    }
  };
  useEffect(() => {
    window.addEventListener('keydown', listener);
    return () => {
      window.removeEventListener('keydown', listener);
    };
  }, []);
  useEffect(() => {
    if (!open && mounted) {
      if (hasEdited) {
        onSave();
      }
    }
  }, [open, hasEdited, mounted]);
  const onSave = () => {
    const wallStore = useWallStore.getState();
    const selectedNode = wallStore.selectedNode;
    const _editValue = wallStore.editValue;
    if (selectedNode && _editValue) {
      selectedNode.data.html = _editValue;
      const newNodes = storeApi.getState().nodes.map((node) => (node.id === selectedNode.id ? selectedNode : node));
      storeApi.setState({ nodes: newNodes });
      if (wallStore.id) {
        message.success('保存到服务器成功', {
          closeOnClick: true,
        });
      } else {
        message.success('保存到本地成功', {
          closeOnClick: true,
        });
      }
      wallStore.saveNodes(newNodes, { showMessage: false });
    }
  };
  let html = selectedNode?.data?.html || '';
  if (html === BlankNoteText) {
    html = '';
  }
  return (
    <div
      className={clsx(
        'transition-all duration-300 bg-white flex flex-col gap-2 h-full w-full overflow-hidden  fixed right-0 top-0 z-10',
        open ? 'open' : 'hidden',
        'w-[800px] xs:w-[100%] sm:w-[100%] md:w-[600px] lg:w-[600px] xl:w-[600px] 2xl:w-[800px]', // 默认宽度，根据屏幕大小适配，小屏幕全屏幕
      )}>
      <div className='flex justify-between items-center h-10'>
        <button onClick={() => setOpen(false)}>
          <X className='w-6 h-6 cursor-pointer ml-2' />
        </button>
        {selectedNode && (
          <div>
            <button className='bg-blue-500 text-white px-4 py-1 rounded-md mr-4 cursor-pointer' onClick={onSave}>
              保存
            </button>
          </div>
        )}
      </div>
      <div
        className='pr-4 mx-4 mb-4 rounded-md pb-4 box-border scrollbar  border border-gray-300 '
        style={{
          height: 'calc(100vh - 2.5rem)',
          overflowY: 'auto',
        }}>
        {selectedNode && open && <Editor className='drawer-editor' value={html} onChange={setEditValue} id={selectedNode.id} />}
      </div>
    </div>
  );
};

export default Drawer;
