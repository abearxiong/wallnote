import React, { useEffect } from 'react';
import WindowManager from './components/WindowManager';
import { demoWindows } from './demo/DemoWindows';
import './style.css';
import { useShallow } from 'zustand/react/shallow';
import { usePanelStore } from './store';
import { useListenCmdB } from './hooks/use-listen-b';

export function ExampleApp() {
  const { data, toggleAICommand, init } = usePanelStore(
    useShallow((state) => {
      return {
        data: state.data,
        toggleAICommand: state.toggleAICommand,
        init: state.init,
      };
    }),
  );
  useEffect(() => {
    init?.();
  }, [init]);
  useListenCmdB(() => {
    toggleAICommand?.();
    console.log('toggleAICommand');
  });
  return (
    <div className='h-screen w-screen overflow-hidden bg-gray-800'>
      <WindowManager windows={data?.windows || []} showTaskbar={data?.showTaskbar} />
    </div>
  );
}

export default ExampleApp;
