import { TextEditor } from '@/modules/tiptap/editor';
import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { Save } from 'lucide-react';
import { useWallStore } from '../wall/store/wall';
import { useShallow } from 'zustand/react/shallow';
import { app } from '../editor/app';

/**
 * 监听ctrl+s保存内容
 * esc退出编辑
 * @param saveContent 保存内容
 * @param exitEdit 退出编辑
 */
export const useListenCtrlS = (saveContent: () => void, exitEdit: () => void) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        saveContent();
      } else if (event.key === 'Escape') {
        exitEdit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [saveContent]);
};
type EditorProps = {
  id?: string;
};
/**
 * Node Edit Editor
 * @param param0
 * @returns
 */
export const NodeTextEditor = ({ id }: EditorProps) => {
  const textEditorRef = useRef<TextEditor | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const { getNodeById, saveNodeById } = useWallStore(useShallow((state) => ({ getNodeById: state.getNodeById, saveNodeById: state.saveNodeById })));
  useEffect(() => {
    const editor = new TextEditor();
    textEditorRef.current = editor;
    editor.createEditor(editorRef.current!, { html: '' });
    getIdContent();
    return () => {
      editor.destroy();
    };
  }, []);
  const getIdContent = async () => {
    if (!id) return;
    const node = await getNodeById(id);
    if (node) {
      textEditorRef.current?.setContent(node.data.html);
    }
  };
  const saveContent = async () => {
    if (!id) return;
    const html = await textEditorRef.current?.getHtml();
    if (html) {
      saveNodeById(id, {
        html: html,
      });
    }
  };
  const exitEdit = () => {
    // 退出编辑
    saveContent();
    setTimeout(() => {
      app.call({
        path: 'panels',
        key: 'close-editor-window',
        payload: {
          data: {
            id,
          },
        },
      });
    }, 100);
  };
  useListenCtrlS(saveContent, exitEdit);

  return (
    <div className={clsx('w-full h-full relative')}>
      <div ref={editorRef} className={clsx('w-full h-full node-editor')}></div>
      <div className='absolute top-2 right-2 cursor-pointer' onClick={() => saveContent()}>
        <Save />
      </div>
    </div>
  );
};
