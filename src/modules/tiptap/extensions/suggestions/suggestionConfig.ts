import { CommandItem } from './commands';
import { CommandsList } from '../../components/CommandsList';
import ReactRenderer from '../../components/ReactRenderer';

export const createSuggestionConfig = (items: CommandItem[]) => {
  return {
    items: ({ query }: { query: string }) => {
      return items.filter(item => item.title.toLowerCase().startsWith(query.toLowerCase()));
    },
    render: () => {
      let component: ReactRenderer | null = null;
      let popup: HTMLElement | null = null;

      const calculatePosition = (view: any, from: number) => {
        const coords = view.coordsAtPos(from);
        const editorRect = view.dom.getBoundingClientRect();
        const popupRect = popup?.getBoundingClientRect();
        
        if (!popup || !popupRect) return { left: coords.left, top: coords.bottom + 10 };
        
        // Default position below the cursor
        let left = coords.left;
        let top = coords.bottom + 10;
        
        // Check if we're near the bottom of the viewport
        const viewportHeight = window.innerHeight;
        const bottomSpace = viewportHeight - coords.bottom;
        const popupHeight = popupRect.height;
        
        // If there's not enough space below, position above
        if (bottomSpace < popupHeight + 10 && coords.top > popupHeight + 10) {
          top = coords.top - popupHeight - 10;
        }
        
        // Check if we're near the right edge of the viewport
        const viewportWidth = window.innerWidth;
        const rightSpace = viewportWidth - coords.left;
        const popupWidth = popupRect.width;
        
        // If there's not enough space to the right, align right edge
        if (rightSpace < popupWidth) {
          left = Math.max(10, viewportWidth - popupWidth - 10);
        }
        
        // Ensure popup stays within editor bounds horizontally if possible
        if (left < editorRect.left) {
          left = editorRect.left;
        }
        
        return { left, top };
      };

      return {
        onStart: (props: any) => {
          component = new ReactRenderer(CommandsList, {
            props,
            editor: props.editor,
          });

          popup = document.createElement('div');
          popup.className = 'commands-popup';
          popup.style.position = 'fixed'; // Use fixed instead of absolute for better viewport positioning
          popup.style.zIndex = '1000';
          document.body.appendChild(popup);

          popup.appendChild(component.element);

          // Initial position
          const { view } = props.editor;
          const { from } = props.range;
          
          // Set initial position to get popup dimensions
          popup.style.left = '0px';
          popup.style.top = '0px';
          
          // Calculate proper position after the popup is rendered
          setTimeout(() => {
            if (!popup) return;
            const { left, top } = calculatePosition(view, from);
            popup.style.left = `${left}px`;
            popup.style.top = `${top}px`;
          }, 0);
        },
        onUpdate: (props: any) => {
          if (!component) return;
          
          component.updateProps(props);

          if (!popup) return;

          // Update position
          const { view } = props.editor;
          const { from } = props.range;
          const { left, top } = calculatePosition(view, from);
          
          popup.style.left = `${left}px`;
          popup.style.top = `${top}px`;
        },
        onKeyDown: (props: any) => {
          if (props.event.key === 'Escape') {
            if (popup) popup.remove();
            if (component) component.destroy();
            return true;
          }
          
          if (component && component.ref && component.ref.current) {
            return component.ref.current.onKeyDown(props);
          }
          
          return false;
        },
        onExit: () => {
          if (popup) popup.remove();
          if (component) component.destroy();
          component = null;
          popup = null;
        },
      };
    },
  };
};