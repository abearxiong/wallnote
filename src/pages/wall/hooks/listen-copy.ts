import { message } from '@/modules/message';
import { useEffect } from 'react';
export const parseIfJson = (str: string) => {
  try {
    const js = JSON.parse(str);
    // 判断js是否是正规的json对象, 初略判断
    if (js && typeof js === 'object') {
      return js;
    }
    return null;
  } catch (e) {
    return null;
  }
};
export const clipboardRead = async () => {
  const read = await navigator.clipboard.read();
  const [clipboardItem] = read;
  if (!clipboardItem) {
    return [];
  }
  const types = clipboardItem.types;
  const typesDataList: { type: string; data: string; blob?: any; base64?: string }[] = [];
  for (let i = 0; i < types.length; i++) {
    const type = types[i];
    const data = await clipboardItem.getType(type);
    switch (type) {
      case 'text/plain':
        const textPlain = await data.text();
        const jsonContent = parseIfJson(textPlain);
        if (jsonContent && jsonContent.type === 'wallnote') {
          typesDataList.push({ type: 'text/json', data: jsonContent, blob: data });
        } else {
          typesDataList.push({ type: 'text/plain', data: textPlain, blob: data });
        }
        break;
      case 'text/html':
        const textHtml = await data.text();
        typesDataList.push({ type: 'text/html', data: textHtml, blob: data });
        break;
      case 'image/png':
        const imagePng = await data.arrayBuffer();
        const arrayBufferToBase64 = (buffer) => {
          let binary = '';
          const bytes = new Uint8Array(buffer);
          const len = bytes.byteLength;
          for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          return window.btoa(binary);
        };
        const imagePngBase64 = arrayBufferToBase64(imagePng);
        const imageData = `data:image/png;base64,${imagePngBase64}`;
        const imageHtml = `<img style="width: 100%; height: 100%;" src="data:${type};base64,${imagePngBase64}" />`;
        typesDataList.push({ type, data: imageHtml, blob: data, base64: imageData });
        break;
      default:
        message.error('暂不支持该类型粘贴');
        break;
    }
  }

  return typesDataList;
};
/**
 * 监听 wind: ctrl+v mac: command+v的粘贴事件
 */
export const useListenPaster = () => {
  useEffect(() => {
    const listener = async (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        const r = await clipboardRead();
        return;
      }
    };
    document.addEventListener('keydown', listener);
    return () => {
      document.removeEventListener('keydown', listener);
    };
  }, []);
};
