import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import clsx from 'clsx';
import { useRef } from 'react';
export const SplitPanel = (porps: any) => {
  const { direction, headerHeight, showHeader, chatBoxHeight, showChatBox, bodyHeight, showFooter, footerClassName, className } = porps;
  const editorRef = useRef<HTMLDivElement>(null);
  return (
    <PanelGroup autoSaveId='example' direction={direction} className='w-full h-full editor-container relative'>
      <Panel minSize={10} defaultSize={headerHeight} className={clsx('editor-header h-10', showHeader ? 'block' : 'hidden')}>
        <div className='w-full h-full'>{/* editor-header */}</div>
      </Panel>
      <PanelResizeHandle className={clsx('editor-resize-handle border-gray-300 border-1', showHeader ? 'block' : 'hidden')} />
      <Panel minSize={10} defaultSize={chatBoxHeight} className={clsx('editor-chat-box h-66', showChatBox ? 'block' : 'hidden')}>
        <div className='w-full h-full'>{/* editor-chat-box */}</div>
      </Panel>
      <PanelResizeHandle className={clsx('editor-resize-handle border-gray-300 border-1', showChatBox ? 'block' : 'hidden')} />
      <Panel minSize={10} defaultSize={bodyHeight}>
        <div ref={editorRef} className={clsx('w-full h-full node-editor', className)}></div>
      </Panel>
      <Panel className={clsx('editor-footer h-10', showFooter ? 'block' : 'hidden', footerClassName)}>
        <div className='w-full h-full'>{/* editor-footer */}</div>
      </Panel>
    </PanelGroup>
  );
};
