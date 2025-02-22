import { useReactFlow } from '@xyflow/react';
import { useEffect } from 'react';

export const useTabNode = () => {
  const reactFlowInstance = useReactFlow();
  useEffect(() => {
    const listener = (event: any) => {
      if (event.key === 'Tab') {
        console.log('tab');
        const nodes = reactFlowInstance.getNodes();
        const selectedNode = nodes.find((node) => node.selected);
        if (!selectedNode) return;
        // 获取选中的节点
        const { x, y } = selectedNode?.position || { x: 0, y: 0 };
        // 根据nodes的position的x和y进行排序，x小的在前，x相等时，y小的在前
        const newNodes = nodes.sort((a, b) => {
          const { x: ax, y: ay } = a.position || { x: 0, y: 0 };
          const { x: bx, y: by } = b.position || { x: 0, y: 0 };
          if (ax < bx) return -1;
          if (ax > bx) return 1;
          return ay - by;
        });
        const nextNode = newNodes.find((node) => {
          if (node.id === selectedNode?.id) return false;
          const { x: nx, y: ny } = node.position;
          if (nx > x) {
            return true;
          } else if (nx === x) {
            if (ny > y) {
              return true;
            }
          }
          return false;
        });
        if (nextNode) {
          const newNodes = nodes.map((node) => {
            if (node.id === nextNode.id) {
              return { ...node, selected: true };
            }
            return { ...node, selected: false };
          });
          reactFlowInstance.setNodes(newNodes);
        } else {
          const newNodes = nodes.map((node) => {
            if (node.id === nodes[0].id) {
              return { ...node, selected: true };
            }
            return { ...node, selected: false };
          });
          reactFlowInstance.setNodes(newNodes);
        }

        event.preventDefault();
        event.stopPropagation();
      }
    };
    window.addEventListener('keydown', listener);
    return () => {
      window.removeEventListener('keydown', listener);
    };
  }, [reactFlowInstance]);
};
