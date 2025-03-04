import React from 'react';
import { createRoot } from 'react-dom/client';

export class ReactRenderer {
  component: any;
  element: HTMLElement;
  ref: React.RefObject<any>;
  props: any;
  root: any;
  constructor(component: any, { props, className }: any) {
    this.component = component;
    const el = document.createElement('div');
    this.element = el;
    this.ref = React.createRef();
    this.props = {
      ...props,
      ref: this.ref,
    };
    el.className = className;
    this.root = createRoot(this.element);
    this.render();
  }

  updateProps(props: any) {
    this.props = {
      ...this.props,
      ...props,
    };
    this.render();
  }

  render() {
    this.root.render(React.createElement(this.component, this.props));
  }

  destroy() {
    this.root.unmount();
  }
}

export default ReactRenderer;
