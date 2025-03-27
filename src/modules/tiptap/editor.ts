import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import Typography from '@tiptap/extension-typography';
import { Markdown } from 'tiptap-markdown';

import Placeholder from '@tiptap/extension-placeholder';
import { Commands, getSuggestionItems, createSuggestionConfig, CommandItem } from './extensions/suggestions';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { all, createLowlight } from 'lowlight';
import 'highlight.js/styles/github.css';
// 根据需要引入的语言支持
import js from 'highlight.js/lib/languages/javascript';
import ts from 'highlight.js/lib/languages/typescript';
import html from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import markdown from 'highlight.js/lib/languages/markdown';
import './editor.css';

const lowlight = createLowlight(all);

// you can also register individual languages
lowlight.register('html', html);
lowlight.register('css', css);
lowlight.register('js', js);
lowlight.register('ts', ts);
lowlight.register('markdown', markdown);

export class TextEditor {
  private editor?: Editor;
  private opts?: { markdown?: string; html?: string; items?: CommandItem[]; onUpdateHtml?: (html: string) => void };
  private element?: HTMLElement;
  private isInitialSetup: boolean = true;

  constructor() {}
  createEditor(el: HTMLElement, opts?: { markdown?: string; html?: string; items?: CommandItem[]; onUpdateHtml?: (html: string) => void }) {
    if (this.editor) {
      this.destroy();
    }
    this.opts = opts;
    this.element = el;
    const html = opts?.html || '';
    const items = opts?.items || getSuggestionItems();
    const suggestionConfig = createSuggestionConfig(items);
    this.isInitialSetup = true;
    this.editor = new Editor({
      element: el, // 指定编辑器容器
      extensions: [
        StarterKit, // 使用 StarterKit 包含基础功能
        Highlight,
        Placeholder.configure({
          placeholder: 'Type @ to see commands (e.g., @today, @list @test )...',
        }),
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
        Commands.configure({
          suggestion: suggestionConfig,
        }),
      ],
      content: html, // 初始化内容,
      onUpdate: () => {
        if (this.isInitialSetup) {
          this.isInitialSetup = false;
          return;
        }
        if (this.opts?.onUpdateHtml) {
          this.opts.onUpdateHtml(this.editor?.getHTML() || '');
        }
      },
    });
  }
  updateSugestionConfig(items: CommandItem[]) {
    if (!this.element) return;
    const element = this.element;
    if (this.editor) {
      const content = this.editor.getHTML(); // Save current content
      const opts = { ...this.opts, html: content, items };
      this.createEditor(element, opts); // Recreate the editor with the new config
    }
  }
  setContent(html: string, emitUpdate?: boolean) {
    this.editor?.commands.setContent(html, emitUpdate);
  }
  /**
   * before set options ,you should has element and editor
   * @param opts
   */
  setOptions(opts: { markdown?: string; html?: string; items?: CommandItem[]; onUpdateHtml?: (html: string) => void }) {
    this.opts = { ...this.opts, ...opts };
    this.createEditor(this.element!, this.opts!);
  }
  getHtml() {
    return this.editor?.getHTML();
  }
  getContent() {
    return this.editor?.getText();
  }
  foucus() {
    this.editor?.view?.focus?.();
  }

  destroy() {
    this.editor?.destroy();
    this.editor = undefined;
  }
}
