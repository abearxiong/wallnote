/**
 * 实现当xyflow在空白处点击，并拖动，有一个矩形框，框选多个节点。
 * 1. 在xyflow的源码中找到矩形框选的实现，找到矩形框选的逻辑
 * 2. 在xyflow的源码中找到空白处点击的实现，找到空白处点击的逻辑
 * 3. 在xyflow的源码中找到拖动的实现，找到拖动的逻辑
 * 4. 将矩形框选的逻辑和空白处点击的逻辑和拖动的逻辑结合起来，实现矩形框选多个节点
 */

import { useState, useEffect, useRef, useMemo } from 'react';
import { useReactFlow, useStoreApi } from '@xyflow/react';
import { useWallStore } from '../store/wall';
import { useShallow } from 'zustand/react/shallow';

import { create } from 'zustand';
type SelectState = {
  isSelecting: boolean;
  selectionBox: { startX: number; startY: number; width: number; height: number } | null;
  setIsSelecting: (isSelecting: boolean) => void;
  setSelectionBox: (selectionBox: { startX: number; startY: number; width: number; height: number } | null) => void;
};
export const useSelectStore = create<SelectState>((set) => ({
  isSelecting: false,
  selectionBox: null,
  setIsSelecting: (isSelecting: boolean) => set({ isSelecting }),
  setSelectionBox: (selectionBox: { startX: number; startY: number; width: number; height: number } | null) => set({ selectionBox }),
}));
type UserSelectOpts = {
  onSelect: (nodes: any[]) => void;
  listenMouseDown?: boolean;
};
export const useSelect = (opts: UserSelectOpts) => {
  const { isSelecting, setIsSelecting, selectionBox, setSelectionBox } = useSelectStore();
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const reactFlowInstance = useReactFlow();
  const storeApi = useStoreApi();
  const wallStore = useWallStore(
    useShallow((state) => {
      return {
        mouseSelect: !state.mouseSelect,
        setMouseSelect: state.setMouseSelect,
      };
    }),
  );
  useEffect(() => {
    const canvas = canvasRef.current!;
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isSelecting, selectionBox, wallStore.mouseSelect]);
  const handleMouseDown = (event) => {
    if (event.target === canvasRef.current) {
      setIsSelecting(true);
      setSelectionBox({ startX: event.clientX, startY: event.clientY, width: 0, height: 0 });
    }
  };

  const handleMouseMove = (event) => {
    if (isSelecting && selectionBox) {
      const newWidth = event.clientX - selectionBox.startX;
      const newHeight = event.clientY - selectionBox.startY;
      setSelectionBox({
        startX: selectionBox.startX,
        startY: selectionBox.startY,
        width: newWidth,
        height: newHeight,
      });
    }
  };

  const handleMouseUp = () => {
    if (isSelecting) {
      const nodes = getNodesWithinSelectionBox(selectionBox);
      opts.onSelect(nodes);
      setIsSelecting(false);
      setSelectionBox(null);
    }
  };
  const getNodesWithinSelectionBox = (box) => {
    // Implement logic to find nodes within the selection box
    // This will depend on how your nodes are structured and rendered
    const nodes = storeApi.getState().nodes;
    const screenPosition = reactFlowInstance.screenToFlowPosition({
      x: box.startX,
      y: box.startY,
    });
    const nodesWithinBox = nodes.filter((node) => {
      const { x, y } = node.position;
      return x >= screenPosition.x && x <= screenPosition.x + box.width && y >= screenPosition.y && y <= screenPosition.y + box.height;
    });
    return nodesWithinBox;
  };

  return {
    isSelecting,
    setIsSelecting,
    selectionBox,
    canvasRef,
  };
};
