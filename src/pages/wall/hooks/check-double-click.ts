import { useCallback, useRef } from 'react';

export const useCheckDoubleClick = ({
  onPaneDoubleClick,
  onPaneClick,
}: {
  onPaneDoubleClick?: (e: React.MouseEvent) => void;
  onPaneClick?: (e: React.MouseEvent) => void;
}) => {
  const lastClickTime = useRef(0);
  const clickTimeOut = useRef<NodeJS.Timeout | null>(null);

  const onCheckPanelDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      const currentTime = Date.now();
      if (currentTime - lastClickTime.current < 300 && lastClickTime.current !== 0) {
        onPaneDoubleClick?.(e); // Use optional chaining to call debounceClick if it's defined
        clearTimeout(clickTimeOut.current!);
        clickTimeOut.current = null;
        lastClickTime.current = 0; // Reset
        return;
      } else if (lastClickTime.current === 0) {
        // First click, setup a timeout to handle single click
        lastClickTime.current = currentTime; // Update the last click time here as well
        clickTimeOut.current = setTimeout(() => {
          onPaneClick?.(e);
          lastClickTime.current = 0; // Reset
        }, 300);
      }
    },
    [onPaneDoubleClick, onPaneClick],
  );

  return { onCheckPanelDoubleClick };
};
