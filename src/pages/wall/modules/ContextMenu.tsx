import React from 'react';
import { ToolbarItem, MenuItem } from './toolbar/Toolbar';
import { ClipboardPaste } from 'lucide-react';
import { clipboardRead } from '../hooks/listen-copy';
import { useReactFlow, useStore } from '@xyflow/react';
import { randomId } from '../utils/random';
import { message } from '@/modules/message';
import { useWallStore } from '../store/wall';
import { useShallow } from 'zustand/react/shallow';
import { min, max } from 'lodash-es';
import { getImageWidthHeightByBase64 } from '../utils/get-image-rect';
interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
}
class HasTypeCheck {
  constructor(list: any[]) {
    this.list = list;
  }
  list: { type?: string; data: any }[];
  hasType = (type = 'type/html') => {
    return this.list.some((item) => item.type === type);
  };
  getType = (type = 'type/html') => {
    return this.list.find((item) => item.type === type);
  };
  getText = () => {
    const hasHtml = this.hasType('text/html');
    if (hasHtml) {
      return {
        code: 200,
        data: this.getType('text/html')?.data || '',
      };
    }
    const hasText = this.hasType('text/plain');
    if (hasText) {
      return {
        code: 200,
        data: this.getType('text/plain')?.data || '',
      };
    }
    return {
      code: 404,
    };
  };
  getJson() {
    const hasJson = this.hasType('text/json');
    if (hasJson) {
      const data = this.getType('text/json')?.data || '';
      return {
        code: 200,
        data: data,
      };
    }
    return {
      code: 404,
    };
  }
}
export const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, onClose }) => {
  const reactFlowInstance = useReactFlow();
  const store = useStore((state) => state);
  const wallStore = useWallStore(
    useShallow((state) => {
      return {
        setNodes: state.setNodes,
        saveNodes: state.saveNodes,
      };
    }),
  );
  // const
  const menuList: MenuItem[] = [
    {
      label: '粘贴',
      icon: <ClipboardPaste />,
      key: 'paste',
      onClick: async () => {
        const readList = await clipboardRead();
        const check = new HasTypeCheck(readList);
        if (readList.length <= 0) {
          message.error('粘贴为空');
          return;
        }
        let content: string = '';
        let hasContent = false;
        const text = check.getText();
        let width = 100;
        let height = 100;
        if (text.code === 200) {
          content = text.data;
          hasContent = true;
          width = min([content.length * 16, 600])!;
          height = max([200, (content.length * 16) / 400])!;
        }
        console.log('result', readList);
        if (!hasContent) {
          const json = check.getJson();
          if (json.code === 200) {
            content = JSON.stringify(json.data, null, 2);
            hasContent = true;
          }
        }
        let noEdit = false;
        if (!hasContent) {
          content = readList[0].data || '';
          const base64 = readList[0].base64;
          const rect = await getImageWidthHeightByBase64(base64);
          width = rect.width;
          height = rect.height;
          noEdit = true;
        }

        const flowPosition = reactFlowInstance.screenToFlowPosition({ x, y });
        const nodes = store.nodes;
        const newNodeData: any = {
          id: randomId(),
          type: 'wallnote',
          position: flowPosition,
          data: {
            width,
            height,
            html: content,
          },
        };
        if (noEdit) {
          newNodeData.data.noEdit = true;
        }
        const newNodes = [newNodeData];
        const _nodes = [...nodes, ...newNodes];
        wallStore.setNodes(_nodes);
        wallStore.saveNodes(_nodes);
        // reactFlowInstance.setNodes(_nodes);
      },
    }, //
  ];
  return (
    <div
      style={{
        position: 'absolute',
        top: y - 20,
        left: x - 20,
        backgroundColor: 'white',
        border: '1px solid #ccc',
        width: 200,
        zIndex: 1000,
      }}
      onMouseLeave={onClose}>
      {menuList.map((item) => (
        <ToolbarItem
          key={item.key}
          className={item.className}
          onClick={() => {
            item.onClick?.();
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
    </div>
  );
};

export default ContextMenu;
