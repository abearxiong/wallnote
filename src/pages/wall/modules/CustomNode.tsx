import { useRef, memo, useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { NodeResizer, useStore, useReactFlow } from '@xyflow/react';
import { useWallStore } from '../store/wall';
import { useShallow } from 'zustand/react/shallow';
import { toast } from 'react-toastify';
import { message } from '@/modules/message';
import { app } from '../app';
import hljs from 'highlight.js';
import { Edit } from 'lucide-react';
export type WallData<T = Record<string, any>> = {
  html: string;
  width?: number;
  height?: number;
  updatedAt?: number;
  [key: string]: any;
} & T;
const ShowContent = (props: { data: WallData; id: string; selected: boolean }) => {
  const [highlightHtml, setHighlightHtml] = useState('');
  const highlight = async (html: string) => {
    const _html = html.replace(/<pre><code class="language-(\w+)">([\s\S]*?)<\/code><\/pre>/g, (match, p1, p2) => {
      return `<pre><code class="language-${p1}">${hljs.highlight(p2, { language: p1 }).value}</code></pre>`;
    });
    return _html;
  };
  useEffect(() => {
    highlight(props.data.html).then((res) => {
      setHighlightHtml(res);
    });
  }, [props.data.html]);
  useEffect(() => {
    const id = props.id;
    const container = document.querySelector('.id' + id);
    if (container) {
      container.innerHTML = highlightHtml;
    }
  }, [highlightHtml, props.data.updatedAt]);
  return (
    <div
      className={clsx('p-2 w-full h-full overflow-y-auto scrollbar tiptap bg-white markdown-body', {}, 'id' + props.id)}
      style={{
        pointerEvents: props.selected ? 'auto' : 'none',
      }}></div>
  );
};

export const CustomNode = (props: { id: string; data: WallData; selected: boolean }) => {
  const data = props.data;
  const contentRef = useRef<HTMLDivElement>(null);
  const reactFlowInstance = useReactFlow();
  const zoom = reactFlowInstance.getViewport().zoom;
  const wallStore = useWallStore(
    useShallow((state) => {
      return {
        id: state.id,
        saveNodes: state.saveNodes,
        checkAndOpen: state.checkAndOpen,
      };
    }),
  );
  const save = (nodes: any[]) => {
    wallStore.saveNodes(nodes);
  };
  const store = useStore((state) => {
    return {
      updateWallRect: (id: string, rect: { width: number; height: number }) => {
        const nodes = state.nodes.map((node) => {
          if (node.id === id) {
            node.data.width = rect.width;
            node.data.height = rect.height;
          }
          return node;
        });
        state.setNodes(nodes);
        save(nodes);
      },
      getNode: (id: string) => {
        return state.nodes.find((node) => node.id === id);
      },
      deleteNode: (id: string) => {
        const nodes = state.nodes.filter((node) => node.id !== id);
        state.setNodes(nodes);
        console.log('save', nodes, id);
        save(nodes);
      },
    };
  });
  const width = data.width || 100;
  const height = data.height || 100;

  const showOpen = () => {
    const node = store.getNode(props.id);
    console.log('node eidt', node);
    app.call({
      path: 'panels',
      key: 'add-editor-window',
      payload: {
        data: {
          pageId: wallStore.id || 'local-browser',
          type: 'wallnote',
          nodeData: node,
        },
      },
    });
  };
  const handleSize = Math.max(8, 8 / zoom);
  return (
    <>
      <div
        className={clsx('absolute -top-2 left-0  bg-gray-300 z-10 w-full h-2 custom-dragger cursor-move', {
          'opacity-0': !props.selected,
        })}
        style={{
          width: `calc(100% + ${handleSize}px)`,
          transform: `translateX(-${handleSize / 2}px)`,
        }}></div>
      <div
        ref={contentRef}
        onDoubleClick={(e) => {
          showOpen();
          e.preventDefault();
        }}
        className={clsx('w-full h-full border relative border-gray-300  min-w-[100px] min-h-[50px] tiptap-preview', {
          'pointer-events-none': !props.selected,
          'pointer-events-auto': props.selected,
        })}
        style={{
          width: width,
          height: height,
        }}>
        <ShowContent data={data} id={props.id} selected={props.selected} />
      </div>
      <div className={clsx('absolute top-0 right-0 cursor-pointer', props.selected ? 'opacity-100' : 'opacity-0')}>
        <button
          className='w-6 h-6  flex items-center justify-center'
          onClick={() => {
            showOpen();
          }}>
          <Edit className='w-4 h-4' />
        </button>
      </div>
      <NodeResizer
        minWidth={100}
        minHeight={50}
        onResizeStart={() => {}}
        isVisible={props.selected}
        color='#d1d5dc'
        onResizeEnd={(e) => {
          const parent = contentRef.current?.parentElement;
          if (!parent) return;
          const width = parent.style.width;
          const height = parent.style.height;
          const widthNum = parseInt(width);
          const heightNum = parseInt(height);
          if (!heightNum || !widthNum) return;
          store.updateWallRect(props.id, { width: widthNum, height: heightNum });
        }}
        handleStyle={
          props.selected
            ? {
                width: handleSize,
                height: handleSize,
                border: 'unset',
              }
            : undefined
        }
      />
    </>
  );
};
export const WallNoteNode = memo(CustomNode);
export const CustomNodeType = {
  wallnote: WallNoteNode,
};
