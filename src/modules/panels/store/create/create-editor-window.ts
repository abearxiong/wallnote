import { WindowData } from '../../types';
import { getDocumentWidthAndHeight } from '../../utils/document-width';

/**
 * 创建编辑器窗口
 * @param id 整个页面的的id
 * @param nodeData 节点数据
 * @param windowData 窗口数据
 * @returns
 */
export const createEditorWindow = (pageId: string, nodeData: any, windowData?: WindowData) => {
  const { width, height } = getDocumentWidthAndHeight();
  return {
    nodeData,
    windowData: {
      id: nodeData.id,
      type: 'editor',
      title: nodeData.title || '编辑器',
      showTitle: true,
      showRounded: true,
      showTaskbar: true,
      showMoreTools: true,
      defaultPosition: {
        x: width - 1000,
        y: 0,
        width: 1000,
        height: height,
        zIndex: 1000,
      },
      moreTools: [
        {
          command: {
            path: 'window',
            key: 'close',
            payload: {
              id: nodeData.id,
            },
          },
          title: '关闭',
          key: 'close',
        },
      ],
      render: {
        command: {
          path: 'editor',
          key: 'render',
          payload: {
            pageId: pageId,
            id: nodeData.id,
          },
        },
      },
      ...windowData,
    },
  };
};
