import { EventEmitter } from 'eventemitter3';
import { WindowData } from '../../types';
import { useContextKey } from '@kevisual/system-lib/dist/web-config';
import { ReactRenderer } from '../../components/ReactRenderer';
import { BaseLoad } from '@kevisual/system-lib/dist/load';
import { QueryRouterServer } from '@kevisual/system-lib/dist/router-browser';

export const emitter = useContextKey<EventEmitter>('emitter', () => {
  return new EventEmitter();
});
// const load = new BaseLoad();

class HtmlRender {
  render({ renderRoot, data }: any) {
    const div = `<div id="${data.id}">${data.title}</div>`;
    renderRoot.appendChild(div);
  }
  destroy() {
    // 什么也不做
  }
}
export class BaseRender {
  /**
   * 在页面当中是否加载
   * */
  isLoaded = false;
  status = 'loading';
  element?: HTMLElement;
  windowData?: WindowData;
  render?: ReactRenderer | HtmlRender;
  type?: 'react' | 'html';
  async load(windowData: WindowData, element: HTMLElement) {
    this.isLoaded = true;
    this.windowData = windowData;
    this.status = 'loaded';
    this.element = element;

    // @ts-ignore
    const app = (await useContextKey('app')) as QueryRouterServer;
    const render = windowData.render;
    console.log('base render', render, render?.command);

    if (render?.command) {
      const res = await app.call({
        path: render.command.path,
        key: render.command.key,
        payload: render.command.payload,
      });
      if (res.code === 200) {
        const { lib, type } = res.body;
        if (type === 'react') {
          const ReactNode = lib;
          // 这是一个打开后就不需要再管理的组件
          const renderNote = new ReactRenderer(ReactNode, {
            props: {
              id: windowData.id,
              windowData: windowData,
            },
            className: 'w-full h-full',
          });
          this.render = renderNote;
          this.element.appendChild(renderNote.element);
        } else if (type === 'html') {
          this.render = new lib() as HtmlRender;
          this.render.render({
            renderRoot: this.element,
            data: windowData,
          });
        }
      } else {
        console.log('render error', res);
      }
    }
  }
  async unload(windowData: WindowData) {
    this.isLoaded = false;
    if (this.type === 'react') {
      this.render?.destroy();
    } else if (this.type === 'html') {
      this.render?.destroy();
    }
    this.status = 'loading';
    this.windowData = undefined;
    this.element = undefined;
  }
}

export class ManagerRender {
  constructor() {
    const that = this;
    emitter.on('window-load', (data: { windowData: WindowData; el: HTMLElement }) => {
      that.load(data.windowData, data.el);
    });
    emitter.on('window-unload', (windowData: WindowData) => {
      that.unload(windowData);
    });
  }
  renders = new Map<string, BaseRender>();
  load(windowData: WindowData, element: HTMLElement) {
    const id = windowData.id;
    if (this.renders.has(id)) {
      this.renders.get(id)?.load(windowData, element);
    } else {
      const render = new BaseRender();
      this.renders.set(id, render);
      render.load(windowData, element);
    }
  }
  unload(windowData: WindowData) {
    const id = windowData.id;
    if (this.renders.has(id)) {
      this.renders.get(id)?.unload(windowData);
    }
  }
}
