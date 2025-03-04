import React, { useState, useCallback, useRef, useEffect, RefObject } from 'react';
import { Maximize2, Minimize2, Minimize, Expand, X, SquareMinus, Maximize, ChevronDown, CommandIcon } from 'lucide-react';
import { WindowData, WindowPosition } from '../types';
import classNames from 'clsx';
import Draggable from 'react-draggable';
import { ResizableBox } from 'react-resizable';
import { getIconForWindowType } from './WindowIcons';
import { useImperativeHandle } from 'react';
import { emitter } from '../modules';
interface WindowManagerProps {
  windows: WindowData[];
  showTaskbar?: boolean;
  onSave?: (windows: WindowData[]) => void;
  onCommand?: () => void;
}

// Minimum window dimensions
const MIN_WINDOW_WIDTH = 300;
const MIN_WINDOW_HEIGHT = 200;

const WindowManager = React.forwardRef(({ windows: initialWindows, showTaskbar = true, onSave, onCommand }: WindowManagerProps, ref) => {
  const [windows, setWindows] = useState<WindowData[]>(initialWindows);
  const [fullscreenWindow, setFullscreenWindow] = useState<string | null>(null);
  const [windowPositions, setWindowPositions] = useState<Record<string, WindowPosition>>({});
  const [activeWindow, setActiveWindow] = useState<string | null>(null);
  const [maxZIndex, setMaxZIndex] = useState(100);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mount, setMount] = useState(false);
  const [update, setUpdate] = useState(0);
  // Create stable refs for each window
  const windowRefs = useRef<Record<string, React.RefObject<HTMLDivElement | null>>>({});
  const draggableRefs = useRef<Record<string, React.RefObject<HTMLDivElement | null>>>({});

  useImperativeHandle(ref, () => ({
    addWindow: (window: WindowData) => {
      addWindow(window);
    },
    getWindows: () => {
      return windows;
    },
    setWindows: (windows: WindowData[]) => {
      console.log('setWindows in manager', windows);
      setWindows(windows);
      setUpdate((prev) => prev + 1);
    },
  }));
  useEffect(() => {
    console.log('initialWindows', initialWindows);
    setWindows(initialWindows);
  }, [initialWindows]);

  // Initialize refs for all windows
  useEffect(() => {
    windows.forEach((window) => {
      if (!windowRefs.current[window.id]) {
        windowRefs.current[window.id] = React.createRef<HTMLDivElement | null>();
      }
      if (!draggableRefs.current[window.id]) {
        draggableRefs.current[window.id] = React.createRef<HTMLDivElement | null>();
      }
    });
  }, [windows]);

  // Initialize window positions
  useEffect(() => {
    const positions: Record<string, WindowPosition> = {};
    windows.forEach((window) => {
      positions[window.id] = {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        zIndex: 1000,
        ...window.position,
      };
    });

    setWindowPositions(positions);
    setMaxZIndex(1000 + windows.length);
    setMount(true);
  }, [windows.length, update]);
  useEffect(() => {
    if (mount) {
      const newWindows = windows
        .map((window) => {
          return {
            ...window,
            position: windowPositions[window.id],
          };
        })
        .sort((a, b) => a.position.zIndex - b.position.zIndex)
        .map((item, index) => {
          return {
            ...item,
            position: {
              ...item.position,
              zIndex: 1000 + index,
            },
          };
        });
      onSave?.(newWindows);
    }
  }, [mount, windowPositions]);
  const addWindow = useCallback((window: WindowData) => {
    const has = windows.find((w) => w.id === window.id);
    if (has) {
      setWindows((prev) => prev.map((w) => (w.id === window.id ? window : w)));
    } else {
      setWindows((prev) => [...prev, window]);
    }
  }, []);
  // Handle window removal
  const handleRemoveWindow = useCallback(
    (windowId: string) => {
      const window = windows.find((w) => w.id === windowId);
      const command = window?.commandList?.find((c) => c.key === 'close');
      if (command) {
        emitter.emit('window-command', { windowData: window, command });
        return;
      }
      setWindows((prev) => prev.filter((w) => w.id !== windowId));
      setWindows((prev) =>
        prev.map((w) => {
          if (w.id === windowId) {
            return { ...w, isMinimized: false };
          }
          return w;
        }),
      );
      if (fullscreenWindow === windowId) {
        setFullscreenWindow(null);
      }
    },
    [fullscreenWindow],
  );

  // Handle window minimize
  const handleMinimizeWindow = useCallback(
    (windowId: string) => {
      let needBringToFront = false;
      setWindows((prev) =>
        prev.map((w) => {
          if (w.id === windowId) {
            needBringToFront = !w.isMinimized;
            return { ...w, isMinimized: !w.isMinimized };
          }
          return w;
        }),
      );

      if (fullscreenWindow === windowId) {
        setFullscreenWindow(null);
      }

      if (needBringToFront) {
        bringToFront(windowId);
      }
    },
    [, fullscreenWindow],
  );

  // Handle window fullscreen
  const handleFullscreenWindow = useCallback((windowId: string) => {
    setFullscreenWindow((prev) => (prev === windowId ? null : windowId));

    // Ensure window is not minimized when going fullscreen
    setWindows((prev) =>
      prev.map((w) => {
        if (w.id === windowId) {
          return { ...w, isMinimized: false };
        }
        return w;
      }),
    );
    // Bring to front when going fullscreen
    bringToFront(windowId);
  }, []);

  // Bring window to front
  const bringToFront = useCallback(
    (windowId: string, e?: any) => {
      setActiveWindow(windowId);
      setMaxZIndex((prev) => prev + 1);
      setWindowPositions((prev) => ({
        ...prev,
        [windowId]: {
          ...prev[windowId],
          zIndex: maxZIndex + 1,
        },
      }));
      if (e) {
        e.stopPropagation();
        return e.target.className.includes('window-draggable');
      }
    },
    [maxZIndex],
  );

  // Handle window resize
  const handleResize = useCallback((windowId: string, e: any, { size }: { size: { width: number; height: number } }) => {
    // Ensure minimum dimensions are respected
    const width = Math.max(MIN_WINDOW_WIDTH, size.width);
    const height = Math.max(MIN_WINDOW_HEIGHT, size.height);

    setWindowPositions((prev) => ({
      ...prev,
      [windowId]: {
        ...prev[windowId],
        width,
        height,
      },
    }));
  }, []);

  // Render window controls
  const renderWindowControls = useCallback(
    (windowId: string) => {
      const isFullscreen = fullscreenWindow === windowId;
      return (
        <div className='flex items-center space-x-2'>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleMinimizeWindow(windowId);
            }}
            className='p-1 hover:bg-gray-200 rounded'>
            <SquareMinus size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleFullscreenWindow(windowId);
            }}
            className='p-1 hover:bg-gray-200 rounded'>
            {isFullscreen ? <Minimize2 size={16} /> : <Expand size={16} />}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleRemoveWindow(windowId);
            }}
            className='p-1 hover:bg-red-200 rounded'>
            <X size={16} />
          </button>
        </div>
      );
    },
    [handleMinimizeWindow, handleFullscreenWindow, handleRemoveWindow],
  );

  // Render the taskbar with minimized windows
  const renderTaskbar = () => {
    const showWindowsList = windows.filter((window) => window.show && window.showTaskbar);
    // if (showWindowsList.length === 0) return null;
    // useEffect(() => {
    //   const handleResize = () => {
    //     // const icons = document.querySelectorAll('.more-icon');
    //     // icons.forEach((iconEl) => {
    //     //   const icon = iconEl as HTMLElement;
    //     //   const button = icon.closest('button');
    //     //   if (button && button.offsetWidth <= 150) {
    //     //     icon.style.display = 'none';
    //     //   } else {
    //     //     icon.style.display = 'block';
    //     //   }
    //     // });
    //   };

    //   window.addEventListener('resize', handleResize);
    //   handleResize(); // Initial check

    //   return () => {
    //     window.removeEventListener('resize', handleResize);
    //   };
    // }, []);
    return (
      <div className=' pointer-events-auto  fixed w-full overflow-x-auto bottom-0 left-0 right-0 bg-gray-200 text-white p-2 flex space-x-2 z-[9000] h-[40px]'>
        <div
          className='flex items-center  space-x-2 cursor-pointer bg-blue-600 rounded-md p-1'
          onClick={() => {
            onCommand?.();
          }}>
          <CommandIcon size={16} />
        </div>
        {showWindowsList.map((window) => {
          const isMinimized = window.isMinimized;
          return (
            <button
              key={window.id}
              className={classNames(
                'px-3 py-1 rounded text-sm max-w-[200px] truncate flex items-center justify-between',
                isMinimized ? 'bg-gray-600 hover:bg-gray-500' : 'bg-blue-600 hover:bg-blue-500',
                activeWindow === window.id && 'shadow-lg',
                'bar-button',
                'cursor-pointer',
              )}
              onClick={() => handleMinimizeWindow(window.id)}>
              <span className='truncate min-w-[8px]'>{window.title}</span>
              <div className='flex items-center space-x-1 ml-2'>
                {/* {isMinimized ? <Maximize className='cursor-pointer more-icon' size={16} /> : <SquareMinus className='cursor-pointer more-icon' size={16} />} */}
                <ChevronDown className='cursor-pointer' size={16} />
                <X
                  className='cursor-pointer x-icon'
                  size={16}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveWindow(window.id);
                  }}
                />
              </div>
            </button>
          );
        })}
      </div>
    );
  };

  // Add this useEffect to handle window resize

  // Render a fixed position window
  const renderFixedWindow = (windowData: WindowData) => {
    const isMinimized = windowData.isMinimized;
    const isFullscreen = fullscreenWindow === windowData.id;
    const position = windowPositions[windowData.id];
    const Icon = getIconForWindowType(windowData.type || 'welcome');
    const showRounded = windowData.showRounded ?? true;
    if (!position) return null;

    // Convert width and height to numbers for Resizable component
    const width = isFullscreen ? window.innerWidth : position.width;
    const height = isFullscreen ? window.innerHeight - 40 : position.height;

    // Get or create refs for this window
    if (!windowRefs.current[windowData.id]) {
      windowRefs.current[windowData.id] = React.createRef<HTMLDivElement | null>();
    }
    if (!draggableRefs.current[windowData.id]) {
      draggableRefs.current[windowData.id] = React.createRef<HTMLDivElement | null>();
    }

    const windowRef = windowRefs.current[windowData.id];
    const draggableRef = draggableRefs.current[windowData.id];
    const zIndex = isFullscreen ? 9999 : windowData.id == '__ai__' ? 3000 : position.zIndex;
    return (
      <div
        key={windowData.id}
        className={classNames(
          'absolute pointer-events-auto', //
          windowData.show && !isMinimized && 'block',
          (!windowData.show || isMinimized) && 'hidden',
        )}
        style={{
          left: isFullscreen ? 0 : position.x,
          top: isFullscreen ? 0 : position.y,
          width: width,
          height: height,
          zIndex: zIndex,
        }}
        ref={windowRef}>
        <div
          className={classNames('window-container', isFullscreen && 'fullscreen', showTaskbar && 'hidden-taskbar', windowData.show && !isMinimized && 'block')}
          style={{
            width: '100%',
            height: '100%',
          }}>
          <Draggable
            handle='.window-title-bar'
            position={{ x: 0, y: 0 }}
            onStart={(e) => bringToFront(windowData.id)}
            onStop={(e, data) => {
              if (!isFullscreen) {
                // Update the window's position in the state
                const newX = position.x + data.x;
                const newY = position.y + data.y;
                setWindowPositions((prev) => ({
                  ...prev,
                  [windowData.id]: {
                    ...prev[windowData.id],
                    x: newX,
                    y: newY,
                  },
                }));
              }
            }}
            nodeRef={draggableRef as RefObject<HTMLElement>}
            allowAnyClick={true}
            disabled={isFullscreen}>
            <div className='window-draggable' ref={draggableRef}>
              <ResizableBox
                width={width}
                height={height}
                onResize={(e, data) => !isFullscreen && handleResize(windowData.id, e, data)}
                // resizeHandles={isFullscreen ? [] : ['e', 's', 'se']}
                resizeHandles={windowData.resizeHandles || ['e', 's', 'se']}
                minConstraints={[MIN_WINDOW_WIDTH, MIN_WINDOW_HEIGHT]}
                draggableOpts={{ disabled: isFullscreen }}>
                <div
                  className={classNames(
                    'window bg-white shadow-lg overflow-hidden border border-gray-300',
                    showRounded && 'rounded-lg',
                    isFullscreen && 'fullscreen',
                    activeWindow === windowData.id && 'active',
                  )}
                  style={{
                    width: `${width}px`,
                    height: `${height}px`,
                  }}
                  onClick={() => bringToFront(windowData.id)}>
                  <div className='window-title-bar bg-gray-100 border-b border-gray-300 px-2 py-1 flex justify-between items-center cursor-move'>
                    <div className='window-title font-medium flex items-center'>
                      {windowData.showTitle && (
                        <>
                          <Icon className='mr-2' size={20} />
                          {windowData.title}
                        </>
                      )}
                    </div>
                    <div className='window-controls'>{renderWindowControls(windowData.id)}</div>
                  </div>
                  <div className='window-content h-[calc(100%-32px)] overflow-auto'>
                    <div className='h-full flex flex-col'>
                      <WindowContent window={windowData} />
                    </div>
                  </div>
                </div>
              </ResizableBox>
            </div>
          </Draggable>
        </div>
      </div>
    );
  };
  return (
    <div className='h-screen w-screen overflow-hidden' ref={containerRef}>
      {windows.map((window) => renderFixedWindow(window))}
      {showTaskbar && renderTaskbar()}
    </div>
  );
});
WindowManager.displayName = 'WindowManager';
export const WindowContent = React.memo((props: { window: WindowData }) => {
  const { window } = props;
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    emitter.emit('window-load', { windowData: window, el: ref.current });
    return () => {
      emitter.emit('window-unload', { windowData: window, el: ref.current });
    };
  }, []);
  return <div data-id={window.id} className='flex-1 overflow-auto editor-window' ref={ref}></div>;
});

export default WindowManager;
