import React, { useEffect, useRef } from 'react';
import WindowManager from './components/WindowManager';
import { demoWindows } from './demo/DemoWindows';
import './style.css';
import { useShallow } from 'zustand/react/shallow';
import { usePanelStore } from './store';
import { useListenCmdB } from './hooks/use-listen-b';
import { managerRender } from './render/main';
console.log('managerRender', managerRender);
export function Panels() {
  const ref = useRef<any>(null);
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
    handleCommand();
  });
  const handleCommand = () => {
    const windows = ref.current?.getWindows();
    const newWindows = toggleAICommand?.(windows);
    // saveWindows?.(newWindows);
    ref.current?.setWindows(newWindows);
    console.log('toggleAICommand', newWindows);
  };
  useEffect(() => {
    console.log('data windows', data);
  }, [data]);
  return (
    <div className='h-screen w-screen overflow-hidden'>
      <WindowManager
        ref={ref}
        windows={data?.windows || []}
        // windows={demoWindows.slice(0, 2)}
        showTaskbar={data?.showTaskbar}
        onCommand={() => {
          handleCommand();
        }}
      />
    </div>
  );
}

export default Panels;
