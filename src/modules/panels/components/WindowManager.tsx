import React, { useState, useCallback, useRef, useEffect, RefObject } from 'react';
import { Maximize2, Minimize2, Minimize, Expand, X, SquareMinus, Maximize, ChevronDown } from 'lucide-react';
import { WindowData, WindowPosition } from '../types';
import classNames from 'clsx';
import Draggable from 'react-draggable';
import { ResizableBox } from 'react-resizable';
import { getIconForWindowType } from './WindowIcons';
import { useImperativeHandle } from 'react';
interface WindowManagerProps {
  windows: WindowData[];
  showTaskbar?: boolean;
  onSave?: (windows: WindowData[]) => void;
}

// Minimum window dimensions
const MIN_WINDOW_WIDTH = 300;
const MIN_WINDOW_HEIGHT = 200;

const WindowManager = React.forwardRef(({ windows: initialWindows, showTaskbar = true, onSave }: WindowManagerProps, ref) => {
  const [windows, setWindows] = useState<WindowData[]>(initialWindows);
  const [minimizedWindows, setMinimizedWindows] = useState<string[]>([]);
  const [fullscreenWindow, setFullscreenWindow] = useState<string | null>(null);
  const [windowPositions, setWindowPositions] = useState<Record<string, WindowPosition>>({});
  const [activeWindow, setActiveWindow] = useState<string | null>(null);
  const [maxZIndex, setMaxZIndex] = useState(100);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mount, setMount] = useState(false);
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
  }, [windows.length]);
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
      if (window?.onHidden) {
        window.onHidden();
        return;
      }
      setWindows((prev) => prev.filter((w) => w.id !== windowId));
      setMinimizedWindows((prev) => prev.filter((id) => id !== windowId));
      if (fullscreenWindow === windowId) {
        setFullscreenWindow(null);
      }
    },
    [fullscreenWindow],
  );

  // Handle window minimize
  const handleMinimizeWindow = useCallback(
    (windowId: string) => {
      if (minimizedWindows.includes(windowId)) {
        setMinimizedWindows((prev) => prev.filter((id) => id !== windowId));
        // Bring window to front when unminimizing
        bringToFront(windowId);
      } else {
        setMinimizedWindows((prev) => [...prev, windowId]);
      }

      if (fullscreenWindow === windowId) {
        setFullscreenWindow(null);
      }
    },
    [minimizedWindows, fullscreenWindow],
  );

  // Handle window fullscreen
  const handleFullscreenWindow = useCallback(
    (windowId: string) => {
      setFullscreenWindow((prev) => (prev === windowId ? null : windowId));

      // Ensure window is not minimized when going fullscreen
      if (minimizedWindows.includes(windowId)) {
        setMinimizedWindows((prev) => prev.filter((id) => id !== windowId));
      }

      // Bring to front when going fullscreen
      bringToFront(windowId);
    },
    [minimizedWindows],
  );

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
    if (showWindowsList.length === 0) return null;
    // useEffect(() => {
    //   const handleResize = () => {
    //     const icons = document.querySelectorAll('.more-icon');
    //     icons.forEach((iconEl) => {
    //       const icon = iconEl as HTMLElement;
    //       const button = icon.closest('button');
    //       if (button && button.offsetWidth <= 150) {
    //         icon.style.display = 'none';
    //       } else {
    //         icon.style.display = 'block';
    //       }
    //     });
    //   };

    //   window.addEventListener('resize', handleResize);
    //   handleResize(); // Initial check

    //   return () => {
    //     window.removeEventListener('resize', handleResize);
    //   };
    // }, []);
    return (
      <div className=' pointer-events-auto fixed w-full overflow-x-auto bottom-0 left-0 right-0 bg-gray-200 text-white p-2 flex space-x-2 z-[9000]'>
        {showWindowsList.map((window) => {
          const isMinimized = minimizedWindows.includes(window.id);
          return (
            <button
              key={window.id}
              className={classNames(
                'px-3 py-1 rounded text-sm max-w-[200px] truncate flex items-center justify-between',
                isMinimized ? 'bg-gray-600 hover:bg-gray-500' : 'bg-blue-600 hover:bg-blue-500',
                activeWindow === window.id && 'shadow-lg',
                'cursor-pointer',
              )}
              onClick={() => handleMinimizeWindow(window.id)}>
              <span className='truncate min-w-[16px]'>{window.title}</span>
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
    const isMinimized = minimizedWindows.includes(windowData.id);
    const isFullscreen = fullscreenWindow === windowData.id;
    const position = windowPositions[windowData.id];
    const Icon = getIconForWindowType(windowData.type || 'welcome');
    const showRounded = windowData.showRounded ?? true;
    if (!position) return null;
    if (isMinimized) return null;

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

    return (
      <div
        key={windowData.id}
        className={classNames('absolute pointer-events-auto', windowData.show && 'block', !windowData.show && 'hidden')}
        style={{
          left: isFullscreen ? 0 : position.x,
          top: isFullscreen ? 0 : position.y,
          width: width,
          height: height,
          zIndex: isFullscreen ? 9999 : position.zIndex,
        }}
        ref={windowRef}>
        <div
          className={classNames('window-container', isFullscreen && 'fullscreen')}
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
                  <div className='window-content h-[calc(100%-32px)] overflow-auto p-4'>
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
    if (ref.current) {
      // 获取属性，判断是否加载对应的应用
    }
    console.log('window editor render', window);
  }, []);
  return <div data-id={window.id} className='flex-1 overflow-auto editor-window' ref={ref}></div>;
});

export default WindowManager;
