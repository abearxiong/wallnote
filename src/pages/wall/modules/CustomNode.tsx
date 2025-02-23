import { useRef, memo, useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { NodeResizer, useStore } from '@xyflow/react';
import { useWallStore } from '../store/wall';
import { useShallow } from 'zustand/react/shallow';
import { toast } from 'react-toastify';
import { message } from '@/modules/message';
import hljs from 'highlight.js';
import { Edit } from 'lucide-react';
export type WallData<T = Record<string, any>> = {
  html: string;
  width?: number;
  height?: number;
  [key: string]: any;
} & T;
const ShowContent = (props: { data: WallData; selected: boolean }) => {
  const html = props.data.html;
  const selected = props.selected;
  const showRef = useRef<HTMLDivElement>(null);
  if (!html) return <div className='w-full h-full flex items-center justify-center '>空</div>;
  const [highlightHtml, setHighlightHtml] = useState('');
  const highlight = async (html: string) => {
    const _html = html.replace(/<pre><code class="language-(\w+)">([\s\S]*?)<\/code><\/pre>/g, (match, p1, p2) => {
      return `<pre><code class="language-${p1}">${hljs.highlight(p2, { language: p1 }).value}</code></pre>`;
    });
    return _html;
  };
  useEffect(() => {
    highlight(html).then((res) => {
      setHighlightHtml(res);
    });
  }, [html]);

  return (
    <div
      ref={showRef}
      className='p-2 w-full h-full overflow-y-auto scrollbar tiptap bg-white markdown-body'
      style={{
        pointerEvents: selected ? 'auto' : 'none',
      }}
      dangerouslySetInnerHTML={{ __html: highlightHtml }}></div>
  );
};

export const CustomNode = (props: { id: string; data: WallData; selected: boolean }) => {
  const data = props.data;
  const contentRef = useRef<HTMLDivElement>(null);
  const selected = props.selected;
  const wallStore = useWallStore(
    useShallow((state) => {
      return {
        setOpen: state.setOpen,
        setSelectedNode: state.setSelectedNode,
        saveNodes: state.saveNodes,
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
  // useEffect(() => {
  //   if (selected) {
  //     const handleDelete = (e: KeyboardEvent) => {
  //       if (e.key === 'Delete') {
  //         store.deleteNode(props.id);
  //       }
  //     };
  //     window.addEventListener('keydown', handleDelete);
  //     return () => window.removeEventListener('keydown', handleDelete);
  //   }
  // }, [selected]);
  const width = data.width || 100;
  const height = data.height || 100;
  const style: React.CSSProperties = {};
  style.width = width;
  style.height = height;
  const showOpen = () => {
    const node = store.getNode(props.id);
    console.log('node eidt', node);
    if (node) {
      if (node.data?.noEdit) {
        message.error('不支持编辑');
        return;
      }
      wallStore.setOpen(true);
      wallStore.setSelectedNode(node);
    } else {
      message.error('节点不存在');
    }
  };
  return (
    <>
      <div
        ref={contentRef}
        onDoubleClick={(e) => {
          showOpen();
          // e.stopPropagation();
          e.preventDefault();
        }}
        className={clsx('w-full h-full border relative border-gray-300  min-w-[100px] min-h-[50px] tiptap-preview')}
        style={style}>
        <ShowContent data={data} selected={props.selected} />
      </div>
      <div className={clsx('absolute top-0 right-0', props.selected ? 'opacity-100' : 'opacity-0')}>
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
      />
    </>
  );
};
export const WallNoteNode = memo(CustomNode);
export const CustomNodeType = {
  wallnote: WallNoteNode,
};
