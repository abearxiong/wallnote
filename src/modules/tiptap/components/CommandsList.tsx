import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { CommandItem } from '../extensions/suggestions/commands';

interface CommandsListProps {
  items: CommandItem[];
  command: (props: { content: string }) => void;
}

export const CommandsList = forwardRef((props: CommandsListProps, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index: number) => {
    const item = props.items[index];

    if (item) {
      props.command({ content: item.content });
    }
  };

  const upHandler = () => {
    setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length);
  };

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length);
  };

  const enterHandler = () => {
    selectItem(selectedIndex);
  };

  useEffect(() => setSelectedIndex(0), [props.items]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === 'ArrowUp') {
        upHandler();
        return true;
      }

      if (event.key === 'ArrowDown') {
        downHandler();
        return true;
      }

      if (event.key === 'Enter') {
        enterHandler();
        return true;
      }

      return false;
    },
  }));

  // Scroll to selected item when it changes
  useEffect(() => {
    const element = document.getElementById(`command-item-${selectedIndex}`);
    if (element) {
      element.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [selectedIndex]);

  return (
    <div className="bg-white rounded-md shadow-lg border border-gray-200 overflow-hidden" style={{ width: '350px', maxHeight: '80vh' }}>
      <div className="p-2 bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
        <div className="text-sm font-medium text-gray-700">Commands ({props.items.length})</div>
        <div className="text-xs text-gray-500">Type to filter commands</div>
      </div>
      
      <div className="max-h-72 overflow-y-auto">
        {props.items.length ? (
          props.items.map((item, index) => (
            <button
              id={`command-item-${index}`}
              key={index}
              className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                index === selectedIndex ? 'bg-blue-100 border-l-4 border-blue-500' : 'border-l-4 border-transparent'
              } hover:bg-gray-50`}
              onClick={() => selectItem(index)}
            >
              <div className="font-medium flex items-center">
                !{item.title}
                {index === selectedIndex && (
                  <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-0.5 rounded">
                    Press Enter to select
                  </span>
                )}
              </div>
              <div className="text-gray-500 text-xs">{item.description}</div>
            </button>
          ))
        ) : (
          <div className="px-4 py-2 text-sm text-gray-500">No results</div>
        )}
      </div>
      
      <div className="bg-gray-50 px-3 py-2 text-xs text-gray-500 border-t flex justify-between items-center sticky bottom-0 z-10">
        <span className="inline-flex items-center">
          <kbd className="px-2 py-1 bg-white rounded border border-gray-300 shadow-sm mr-1">↑</kbd>
          <kbd className="px-2 py-1 bg-white rounded border border-gray-300 shadow-sm">↓</kbd>
          <span className="ml-1">to navigate</span>
        </span>
        <span className="inline-flex items-center">
          <kbd className="px-2 py-1 bg-white rounded border border-gray-300 shadow-sm">Enter</kbd>
          <span className="ml-1">to select</span>
        </span>
      </div>
    </div>
  );
});

CommandsList.displayName = 'CommandsList';