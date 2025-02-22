import { marked } from 'marked';
import TurndownService from 'turndown';
export const md2html = async (md: string) => {
  return marked.parse(md);
};

export const html2md = async (html: string) => {
  const turndownService = new TurndownService();
  return turndownService.turndown(html);
};
