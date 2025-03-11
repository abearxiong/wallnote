import { TextEditor } from '@/modules/tiptap/editor';
import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

export const useListenCtrlEnter = (callback: () => void) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'Enter') {
        event.preventDefault();
        callback();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
};
type EditorProps = {
  className?: string;
  value?: string;
  id?: string;
  onChange?: (value: string) => void;
};
export const AiEditor = ({ className, value, onChange, id }: EditorProps) => {
  const textEditorRef = useRef<TextEditor | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const [mount, setMount] = useState(false);
  useEffect(() => {
    const editor = new TextEditor();
    textEditorRef.current = editor;
    editor.createEditor(editorRef.current!, {
      html: value,
      onUpdateHtml: (html) => {
        onChange?.(html);
      },
    });
    setMount(true);
    return () => {
      editor.destroy();
    };
  }, []);
  useListenCtrlEnter(() => {
    context?.app.call({
      path: 'command',
      key: 'handle',
      payload: {
        html: textEditorRef.current?.getHtml() || '',
      },
    });
  });
  useEffect(() => {
    if (textEditorRef.current && id && mount) {
      textEditorRef.current.setContent(value || '');
    }
  }, [id, mount]);
  return (
    <div className={clsx('w-full h-full editor-container relative', className)}>
      <div ref={editorRef} className={clsx('w-full h-full node-editor', className)}></div>
    </div>
  );
};
