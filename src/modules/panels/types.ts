import { ResizeHandle } from 'react-resizable';
export interface WindowPosition {
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
}
export interface WindowData {
  // 窗口的唯一标识
  id: string;
  // 窗口的标题
  title: string;
  // 窗口的类型 notebook,command,code,document,image,calculator,welcome,analytics,settings,layers,database,server,terminal
  type?: string;
  // 是否最小化
  isMinimized?: boolean;
  // 是否全屏
  isFullscreen?: boolean;
  // 是否显示标题
  showTitle?: boolean;
  // 是否显示圆角
  showRounded?: boolean;
  // 是否显示在任务栏
  showTaskbar?: boolean;
  // 窗口的resize手柄
  resizeHandles?: ResizeHandle[];
  // 窗口的默认位置
  position?: WindowPosition;
  // 窗口的默认位置
  defaultPosition?: WindowPosition;
  // 是否显示
  show?: boolean;
  // 是否显示更多工具
  showMoreTools?: boolean;
  // 更多工具
  moreTools?: MoreTool[];
  // 当隐藏窗口存在，只关闭隐藏窗口，不退出程序
  onHidden?: () => void;
}
export interface MoreTool {
  // 工具的名称
  title?: string;
  description?: string;
  path?: string;
  key?: string;
  // 工具的图标
  icon?: string;
  // 工具的点击事件
  onClick?: () => void;
}
