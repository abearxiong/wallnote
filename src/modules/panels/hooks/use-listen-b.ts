import { useEffect } from 'react';
export const isMac = navigator.userAgent.includes('Mac');

export const useListenCmdB = (callback: () => void) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Command key on macOS
      if (isMac ? event.metaKey && event.key === 'b' : event.ctrlKey && event.key === 'b') {
        callback();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
};
