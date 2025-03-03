import React from 'react';
import {
  Code,
  FileText,
  BarChart2,
  Settings,
  Layers,
  Database,
  Server,
  Terminal,
  Image,
  Calculator,
  MessageSquare,
  DivideIcon,
  NotebookPen,
  SquareTerminal,
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';

// Map of window types to their corresponding icons
const windowTypeIcons: Record<string, LucideIcon> = {
  code: Code,
  document: FileText,
  analytics: BarChart2,
  settings: Settings,
  layers: Layers,
  database: Database,
  server: Server,
  terminal: Terminal,
  image: Image,
  calculator: Calculator,
  welcome: MessageSquare,
  notebook: NotebookPen, // 笔记本
  command: SquareTerminal, // 命令行
  // Add more types as needed
};

// Default colors for each window type
export const windowTypeColors: Record<string, string> = {
  code: 'text-blue-600',
  document: 'text-gray-600',
  analytics: 'text-purple-600',
  settings: 'text-gray-600',
  layers: 'text-indigo-600',
  database: 'text-green-600',
  server: 'text-red-600',
  terminal: 'text-gray-600',
  image: 'text-pink-600',
  calculator: 'text-yellow-600',
  welcome: 'text-blue-600',
  // Add more types as needed
};

// Function to get the icon component for a window type
export const getIconForWindowType = (type: string): LucideIcon => {
  return windowTypeIcons[type] || MessageSquare; // Default to MessageSquare if type not found
};
export const getColorForWindowType = (type: string): string => {
  return windowTypeColors[type] || 'text-gray-600'; // Default to gray if type not found
};
