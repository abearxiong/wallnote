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
import { message } from '@/modules/message';
import { useShallow } from 'zustand/react/shallow';
import { BlankNoteText } from './constants';
import { Toolbar } from './modules/toolbar/Toolbar';
// import { useNavigate, useParams } from 'react-router-dom';
import { SaveModal } from './modules/FormDialog';
import { useTabNode } from './hooks/tab-node';
import { Button } from '@mui/material';
import { useListenPaster } from './hooks/listen-copy';
import { ContextMenu } from './modules/ContextMenu';
import { useSelect } from './hooks/use-select';
import clsx from 'clsx';
import { AppendDemo, DemoLogin } from '../demo-login';
type NodeData = {
  id: string;
  position: XYPosition;
  data: any;
};
export function FlowContent() {
  const reactFlowInstance = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState<NodeData>([]);

  const wallStore = useWallStore(
    useShallow((state) => {
      return {
        nodes: state.nodes,
        saveNodes: state.saveNodes,
        saveDataNode: state.saveDataNode,
        checkAndOpen: state.checkAndOpen,
        mouseSelect: state.mouseSelect, // 鼠标模式,不能拖动
        setMouseSelect: state.setMouseSelect,
      };
    }),
  );
  const { isSelecting, selectionBox, setIsSelecting, canvasRef } = useSelect({
    onSelect: (nodes) => {
      setSelectedNodes(nodes);
    },
    listenMouseDown: !wallStore.mouseSelect,
  });
  const store = useStore((state) => state);
  const [mount, setMount] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  const _onNodesChange = useCallback((changes: NodeChange[]) => {
    const [change] = changes;
    if (change.type === 'remove') {
      wallStore.saveNodes(reactFlowInstance.getNodes().filter((item) => item.id !== change.id));
    }
    if (change.type === 'position' && change.dragging === false) {
      getNewNodes(false, changes);
    }
    onNodesChange(changes);
  }, []);
  const setSelectedNodes = (nodes: any[]) => {
    const _nodes = reactFlowInstance.getNodes();
    const selectedNodes = nodes.map((node) => node.id);
    const newNodes = _nodes.map((node) => {
      if (selectedNodes.includes(node.id)) {
        return { ...node, selected: true };
      }
      delete node.selected;
      return node;
    });

    reactFlowInstance.setNodes(newNodes);
  };
  useEffect(() => {
    setNodes(wallStore.nodes);
    setMount(true);
    return () => {
      setMount(false);
    };
  }, [wallStore.nodes]);
  const onNodeDoubleClick = (event, node) => {
    wallStore.checkAndOpen(true, node);
  };
  const getNewNodes = (showMessage = true, changes?: NodeChange[]) => {
    const nodes = reactFlowInstance.getNodes();
    // wallStore.saveNodes(nodes, { showMessage: showMessage });
    // console.log('change', changes);
    const operateNodes = nodes.filter((node) => {
      return changes?.some((change) => change.type === 'position' && change.id === node.id);
    });
    console.log('operateNodes', operateNodes);
    wallStore.saveDataNode(operateNodes);
  };
  useEffect(() => {
    if (mount) {
      // console.log('nodes', nodes);
    }
  }, [nodes, mount]);
  useTabNode();
  // useListenPaster();
  // 添加新节点的函数
  const onPaneDoubleClick = (event) => {
    // 计算节点位置
    const x = event.clientX;
    const y = event.clientY;
    const postion = reactFlowInstance.screenToFlowPosition({ x, y });
    const newNode = {
      id: randomId(), // 确保每个节点有唯一的ID
      type: 'wallnote', // 节点类型
      position: postion, // 使用事件的客户端坐标
      data: { html: BlankNoteText },
    };
    setNodes((nds) => {
      const newNodes = nds.concat(newNode);
      return newNodes;
    });
    setTimeout(() => {
      wallStore.checkAndOpen(true, newNode);
      // getNewNodes();
      wallStore.saveDataNode([newNode]);
    }, 200);
  };
  const hasFoucedNode = useMemo(() => {
    return !!store.nodes.find((node) => node.selected);
  }, [store.nodes]);
  const { onCheckPanelDoubleClick } = useCheckDoubleClick({
    onPaneDoubleClick,
  });
  const handleContextMenu = (event) => {
    event.preventDefault();
    setContextMenu({ x: event.clientX, y: event.clientY });
  };
  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  return (
    <>
      <div style={{ width: '100%', height: '100%', position: 'fixed', top: 0, left: 0, zIndex: 100 }} ref={canvasRef!}>
        <ReactFlow
          nodes={nodes}
          // debug={DEV_SERVER}
          fitView
          onNodesChange={_onNodesChange}
          onNodeDoubleClick={onNodeDoubleClick}
          onPaneClick={onCheckPanelDoubleClick}
          zoomOnScroll={true}
          preventScrolling={!hasFoucedNode}
          onContextMenu={handleContextMenu}
          minZoom={0.05}
          maxZoom={20}
          className='cursor-grab'
          style={{ pointerEvents: wallStore.mouseSelect ? 'auto' : 'none' }}
          nodeTypes={CustomNodeType}>
          <Controls className='bottom-10!'>
            <button
              type='button'
              className={clsx('react-flow__controls-button react-flow__controls-fitview', {
                'text-gray-500!': !wallStore.mouseSelect,
              })}
              title='fit view'
              aria-label='fit view'
              onClick={() => {
                wallStore.setMouseSelect(!wallStore.mouseSelect);
                if (wallStore.mouseSelect) {
                  message.info('框选模式');
                } else {
                  message.info('拖动模式');
                }
              }}>
              <svg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='currentColor' className='remixicon w-4 h-4'>
                <path d='M15.3873 13.4975L17.9403 20.5117L13.2418 22.2218L10.6889 15.2076L6.79004 17.6529L8.4086 1.63318L19.9457 12.8646L15.3873 13.4975ZM15.3768 19.3163L12.6618 11.8568L15.6212 11.4459L9.98201 5.9561L9.19088 13.7863L11.7221 12.1988L14.4371 19.6583L15.3768 19.3163Z'></path>
              </svg>
            </button>
          </Controls>
          <MiniMap />
          <Background gap={[14, 14]} size={2} color='#E4E5E7' />
          <Panel position='top-left'>
            <Toolbar />
          </Panel>
          <Panel>
            <SaveModal />
            {contextMenu && <ContextMenu x={contextMenu.x} y={contextMenu.y} onClose={handleCloseContextMenu} />}
          </Panel>
        </ReactFlow>
        {isSelecting && selectionBox && (
          <div
            style={{
              position: 'absolute',
              border: '1px dashed #000',
              backgroundColor: 'rgba(0, 0, 255, 0.1)',
              left: selectionBox.startX,
              top: selectionBox.startY,
              width: selectionBox.width,
              height: selectionBox.height,
            }}
          />
        )}
      </div>
    </>
  );
}
export const Flow = ({ id }: { checkLogin?: boolean; id?: string }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <DemoLogin />;
  }
  const wallStore = useWallStore(
    useShallow((state) => {
      return {
        loaded: state.loaded,
        init: state.init,
        clearId: state.clearId,
      };
    }),
  );

  useEffect(() => {
    wallStore.init(id);
  }, [id]);

  if (!wallStore.loaded) {
    return <div>loading...</div>;
  } else if (wallStore.loaded === 'error') {
    return (
      <div className='flex flex-col items-center justify-center h-screen gap-4'>
        <div className='text-2xl font-bold'>获取失败，请稍后刷新重试</div>
      </div>
    );
  }
  return (
    <ReactFlowProvider>
      <FlowContent />
    </ReactFlowProvider>
  );
};
