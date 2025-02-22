import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import Typography from '@tiptap/extension-typography';
import { Markdown } from 'tiptap-markdown';

import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { all, createLowlight } from 'lowlight';
import 'highlight.js/styles/github.css';
// 根据需要引入的语言支持
import js from 'highlight.js/lib/languages/javascript';
import ts from 'highlight.js/lib/languages/typescript';
import html from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import markdown from 'highlight.js/lib/languages/markdown';
const lowlight = createLowlight(all);

// you can also register individual languages
lowlight.register('html', html);
lowlight.register('css', css);
lowlight.register('js', js);
lowlight.register('ts', ts);
lowlight.register('markdown', markdown);

export class TextEditor {
  private editor?: Editor;

  constructor() {}
  createEditor(el: HTMLElement, opts?: { markdown?: string; html?: string }) {
    if (this.editor) {
      this.destroy();
    }
    const html = opts?.html || '';
    this.editor = new Editor({
      element: el, // 指定编辑器容器
      extensions: [
        StarterKit, // 使用 StarterKit 包含基础功能
        Highlight,
        Typography,
        Markdown,
        CodeBlockLowlight.extend({
          addKeyboardShortcuts() {
            return {
              Tab: () => {
                const { state, dispatch } = this.editor.view;
                const { tr, selection } = state;
                const { from, to } = selection;

                // 插入4个空格的缩进
                dispatch(tr.insertText('    ', from, to));
                return true;
              },
              'Shift-Tab': () => {
                const { state, dispatch } = this.editor.view;
                const { tr, selection } = state;
                const { from, to } = selection;

                // 获取当前选中的文本
                const selectedText = state.doc.textBetween(from, to, '\n');

                // 取消缩进：移除前面的4个空格
                const unindentedText = selectedText.replace(/^ {1,4}/gm, '');
                dispatch(tr.insertText(unindentedText, from, to));
                return true;
              },
            };
          },
        }).configure({
          lowlight,
        }),
      ],
      content: html, // 初始化内容
    });
  }
  setContent(html: string) {
    this.editor?.commands.setContent(html);
  }
  getHtml() {
    return this.editor?.getHTML();
  }
  getContent() {
    return this.editor?.getText();
  }
  onContentChange(callback: (html: string) => void) {
    this.editor?.off('update'); // 移除之前的监听
    this.editor?.on('update', () => {
      callback(this.editor?.getHTML() || '');
    });
  }
  foucus() {
    this.editor?.view?.focus?.();
  }

  destroy() {
    this.editor?.destroy();
    this.editor = undefined;
  }
}
