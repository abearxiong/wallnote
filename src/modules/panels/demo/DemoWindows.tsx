import { WindowData } from '../types';

export const createEditorWindow = (data: any): WindowData => {
  return {
    ...data,
    showTitle: true,
    show: true,
    showTaskbar: true,
    showRounded: false,
  };
};
const windowPositions = {
  window1: {
    x: 50,
    y: 50,
    width: 300,
    height: 200,
    zIndex: 1000,
  },
  window2: {
    x: 410,
    y: 50,
    width: 300,
    height: 200,
    zIndex: 1001,
  },
  window3: {
    x: 770,
    y: 50,
    width: 300,
    height: 200,
    zIndex: 1002,
  },
  window4: {
    x: 1130,
    y: 50,
    width: 300,
    height: 200,
    zIndex: 1003,
  },
  'code-editor': {
    x: 50,
    y: 230,
    width: 300,
    height: 200,
    zIndex: 1004,
  },
  document: {
    x: 410,
    y: 230,
    width: 300,
    height: 200,
    zIndex: 1005,
  },
  analytics: {
    x: 770,
    y: 230,
    width: 300,
    height: 200,
    zIndex: 1006,
  },
  settings: {
    x: 1130,
    y: 230,
    width: 300,
    height: 200,
    zIndex: 1007,
  },
  layers: {
    x: 50,
    y: 410,
    width: 300,
    height: 200,
    zIndex: 1008,
  },
  database: {
    x: 410,
    y: 410,
    width: 300,
    height: 200,
    zIndex: 1009,
  },
  server: {
    x: 770,
    y: 410,
    width: 300,
    height: 200,
    zIndex: 1010,
  },
  terminal: {
    x: 1130,
    y: 410,
    width: 300,
    height: 200,
    zIndex: 1011,
  },
  command: {
    x: 50,
    y: 590,
    width: 300,
    height: 200,
  },
};

// Demo windows data using the createEditorWindow function
export const demoWindows: WindowData[] = [
  createEditorWindow({ title: 'Welcome', id: 'window1', type: 'welcome' }),
  createEditorWindow({ title: 'Image Viewer', id: 'window2', type: 'image' }),
  createEditorWindow({ title: 'Text Editor', id: 'window3', type: 'document' }),
  createEditorWindow({ title: 'Calculator', id: 'window4', type: 'calculator' }),
  createEditorWindow({ title: 'Code Editor', id: 'code-editor', type: 'code' }),
  createEditorWindow({ title: 'Document', id: 'document', type: 'document' }),
  createEditorWindow({ title: 'Analytics', id: 'analytics', type: 'analytics' }),
  createEditorWindow({ title: 'Settings', id: 'settings', type: 'settings' }),
  createEditorWindow({ title: 'Layers', id: 'layers', type: 'layers' }),
  createEditorWindow({ title: 'Database', id: 'database', type: 'database' }),
  createEditorWindow({ title: 'Server', id: 'server', type: 'server' }),
  createEditorWindow({ title: 'Terminal', id: 'terminal', type: 'terminal' }),
  createEditorWindow({ title: 'Command', id: 'command', type: 'command' }),
].map((window) => ({ ...window, position: windowPositions[window.id] }));
