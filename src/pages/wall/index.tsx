import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  Node,
  useReactFlow,
  ReactFlowProvider,
  Panel,
  useStoreApi,
  useStore,
  XYPosition,
  NodeChange,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import { useWallStore } from './store/wall';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useCheckDoubleClick } from './hooks/check-double-click';
import { randomId } from './utils/random';
import { CustomNodeType } from './modules/CustomNode';
import Drawer from './modules/Drawer';
import { message } from '@/modules/message';
import { useShallow } from 'zustand/react/shallow';
import { BlankNoteText } from './constants';
import { Toolbar } from './modules/toolbar/Toolbar';
import { useUserWallStore } from './store/user-wall';
import { useNavigate, useParams } from 'react-router-dom';
import { SaveModal } from './modules/FormDialog';
import { useTabNode } from './hooks/tab-node';
import { Button } from '@mui/material';
type NodeData = {
  id: string;
  position: XYPosition;
  data: any;
};
export function FlowContent() {
  const reactFlowInstance = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState<NodeData>([]);
  const wallStore = useWallStore((state) => state);
  const store = useStore((state) => state);
  const [mount, setMount] = useState(false);
  const _onNodesChange = useCallback((changes: NodeChange[]) => {
    const [change] = changes;
    if (change.type === 'position' && change.dragging === false) {
      // console.log('position changes', change);
      getNewNodes();
    }
    onNodesChange(changes);
  }, []);
  useEffect(() => {
    setNodes(wallStore.nodes);
    setMount(true);
    return () => {
      setMount(false);
    };
  }, [wallStore.nodes]);
  const onNodeDoubleClick = (event, node) => {
    wallStore.setOpen(true);
    wallStore.setSelectedNode(node);
  };
  const getNewNodes = () => {
    const nodes = reactFlowInstance.getNodes();
    wallStore.saveNodes(nodes);
  };
  useEffect(() => {
    if (mount) {
      // console.log('nodes', nodes);
    }
  }, [nodes, mount]);
  useTabNode();
  // 添加新节点的函数
  const onPaneDoubleClick = (event) => {
    // 计算节点位置
    const x = event.clientX;
    const y = event.clientY;
    const postion = reactFlowInstance.screenToFlowPosition({ x, y });
    const newNode = {
      id: randomId(), // 确保每个节点有唯一的ID
      type: 'wall', // 节点类型
      position: postion, // 使用事件的客户端坐标
      data: { html: BlankNoteText },
    };
    setNodes((nds) => {
      const newNodes = nds.concat(newNode);
      getNewNodes();
      return newNodes;
    });
    message.success('添加节点成功');
    setTimeout(() => {
      wallStore.setSelectedNode(newNode);
      wallStore.setOpen(true);
    }, 200);
  };
  const hasFoucedNode = useMemo(() => {
    return !!store.nodes.find((node) => node.selected);
  }, [store.nodes]);
  const { onCheckPanelDoubleClick } = useCheckDoubleClick({
    onPaneDoubleClick,
  });
  return (
    <ReactFlow
      nodes={nodes}
      // debug={DEV_SERVER}
      fitView
      onNodesChange={_onNodesChange}
      onNodeDoubleClick={onNodeDoubleClick}
      onPaneClick={onCheckPanelDoubleClick}
      zoomOnScroll={true}
      preventScrolling={!hasFoucedNode}
      nodeTypes={CustomNodeType}>
      <Controls />
      <MiniMap />
      <Background gap={[14, 14]} size={2} color='#E4E5E7' />
      <Panel position='top-left'>
        <Toolbar />
      </Panel>
      <Panel>
        <Drawer />
        <SaveModal />
      </Panel>
    </ReactFlow>
  );
}
export const Flow = ({ checkLogin = true }: { checkLogin?: boolean }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const wallStore = useWallStore(
    useShallow((state) => {
      return {
        loaded: state.loaded,
        init: state.init,
      };
    }),
  );

  useEffect(() => {
    wallStore.init(id);
    console.log('checkLogin', checkLogin, id);
  }, [id, checkLogin]);

  if (!wallStore.loaded) {
    return <div>loading...</div>;
  } else if (wallStore.loaded === 'error') {
    return (
      <div className='flex flex-col items-center justify-center h-screen gap-4'>
        <div className='text-2xl font-bold'>获取失败，请稍后刷新重试,或者转到首页</div>
        <Button
          variant='contained'
          onClick={() => {
            navigate('/');
          }}>
          转到首页
        </Button>
      </div>
    );
  }
  return (
    <ReactFlowProvider>
      <FlowContent />
    </ReactFlowProvider>
  );
};
export const FlowStatus = () => {
  const { nodes } = useWallStore();
  const reactFlow = useReactFlow();
  const flowStore = useStore((state) => state);
  return (
    <div>
      <div>节点数量: {nodes.length}</div>
    </div>
  );
};
