import React, { useMemo } from 'react';
import { ToolbarItem, MenuItem } from './toolbar/Toolbar';
import { ClipboardPaste, Copy } from 'lucide-react';
import { clipboardRead } from '../hooks/listen-copy';
import { useReactFlow, useStore } from '@xyflow/react';
import { randomId } from '../utils/random';
import { message } from '@/modules/message';
import { useWallStore } from '../store/wall';
import { useShallow } from 'zustand/react/shallow';
import { getImageWidthHeightByBase64, getTextWidthHeight } from '../utils/get-image-rect';
interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
}
type NewNodeData = {
  id: string;
  type: 'wallnote';
  position: { x: number; y: number };
  data: {
    width: number;
    height: number;
    html: string;
    dataType?: string;
  };
};
class HasTypeCheck {
  newNodeData: NewNodeData;
  constructor(list: any[], position: { x: number; y: number }) {
    this.list = list;
    this.newNodeData = {
      id: randomId(),
      type: 'wallnote',
      position,
      data: { width: 0, height: 0, html: '' },
    };
  }
  list: { type?: string; data: any; base64?: string }[];
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
        data: {
          html: this.getType('text/html')?.data || '',
          dataType: 'text/html',
        },
      };
    }
    const hasText = this.hasType('text/plain');
    if (hasText) {
      return {
        code: 200,
        data: {
          html: this.getType('text/plain')?.data || '',
          dataType: 'text/plain',
        },
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
  async getData() {
    const json = this.getJson();
    if (json.code === 200) {
      if (json.data.type === 'wallnote') {
        const { selected, ...rest } = json.data;
        const newNodeData = {
          ...this.newNodeData,
          ...rest,
          id: this.newNodeData.id,
          position: this.newNodeData.position,
        };
        this.newNodeData = newNodeData;
        return this.newNodeData;
      } else {
        this.newNodeData.data.html = JSON.stringify(json.data, null, 2);
        return this.newNodeData;
      }
    }

    const text = this.getText();
    if (text.code === 200) {
      const { html, dataType } = text.data || { html: '', dataType: 'text/html' };
      this.newNodeData.data.html = html;
      let maxWidth = 600;
      let fontSize = 16;
      let maxHeight = 400;
      let minHeight = 100;
      if (dataType === 'text/html') {
        maxWidth = 400;
        fontSize = 10;
        maxHeight = 200;
        minHeight = 50;
      }
      const wh = await getTextWidthHeight({ str: html, width: 400, maxHeight, minHeight, fontSize });
      this.newNodeData.data.width = wh.width;
      this.newNodeData.data.height = wh.height;
      return this.newNodeData;
    }
    // 图片
    const { base64, type } = this.list[0];
    const rect = await getImageWidthHeightByBase64(base64);
    this.newNodeData.data.width = rect.width;
    this.newNodeData.data.height = rect.height;
    this.newNodeData.data.dataType = type;
    this.newNodeData.data.html = `<img src="${base64}" alt="图片" />`;
    return this.newNodeData;
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
  const copyMenu = {
    label: '复制',
    icon: <Copy />,
    key: 'copy',
    onClick: async () => {
      const nodes = reactFlowInstance.getNodes();
      const selectedNode = nodes.find((node) => node.selected);
      if (!selectedNode) {
        message.error('没有选中节点');
        return;
      }
      const copyData = JSON.stringify(selectedNode);
      navigator.clipboard.writeText(copyData);
      message.success('复制成功');
      setTimeout(() => {
        onClose();
      }, 1000);
    },
  };
  const pasteMenu = {
    label: '粘贴',
    icon: <ClipboardPaste />,
    key: 'paste',
    onClick: async () => {
      const readList = await clipboardRead();
      const flowPosition = reactFlowInstance.screenToFlowPosition({ x, y });
      const check = new HasTypeCheck(readList, flowPosition);
      if (readList.length <= 0) {
        message.error('粘贴为空');
        return;
      }
      const newNodeData = await check.getData();
      const nodes = store.nodes;
      const _nodes = [...nodes, newNodeData];
      wallStore.setNodes(_nodes);
      wallStore.saveNodes(_nodes);
      // reactFlowInstance.setNodes(_nodes);
    },
  };
  const menuList = useMemo(() => {
    const selected = store.nodes.find((node) => node.selected);
    if (selected) {
      return [copyMenu, pasteMenu] as MenuItem[];
    }
    return [pasteMenu] as MenuItem[];
  }, [store.nodes]);

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
