import { TextEditor } from '@/modules/tiptap/editor';
import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

type EditorProps = {
  className?: string;
  value?: string;
  id?: string;
  onChange?: (value: string) => void;
};
export const Editor = ({ className, value, onChange, id }: EditorProps) => {
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
