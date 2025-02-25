export const getImageWidthHeightByBase64 = async (
  b64str: any,
): Promise<{
  width: number;
  height: number;
}> => {
  return new Promise((resolve, reject) => {
    // 创建 Canvas 对象
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    // 创建 Image 对象
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const width = img.width;
      const height = img.height;
      console.log(`宽度: ${width}, 高度: ${height}`);
      resolve({ width, height });
      canvas.remove();
    };
    img.onerror = () => {
      console.error('无法加载图片');
      reject(new Error('无法加载图片'));
      canvas.remove();
    };
    img.src = b64str;
  });
};

/**
 * 我有一个字符串，在在宽度为width的元素当中，自动换行，需要知道最后有多少行。
 * 不使用canvas，通过文本font-size=16px，计算有多少行
 * @param str
 * @param width
 */
export const getTextWidthHeight = async ({
  str,
  width,
  fontSize = 16,
  maxHeight = 600,
  minHeight = 100,
}: {
  str: string;
  width: number;
  fontSize?: number;
  maxHeight?: number;
  minHeight?: number;
}) => {
  function calculateTextHeight(text: string, width: number, fontSize: number = 16): number {
    // 创建一个隐藏的 DOM 元素来测量文本高度
    const element = document.createElement('div');
    element.style.position = 'absolute';
    element.style.visibility = 'hidden';
    element.style.width = `${width}px`;
    element.style.fontSize = `${fontSize}px`;
    element.style.lineHeight = '1.2'; // 假设行高为 1.2 倍字体大小
    element.style.whiteSpace = 'pre-wrap'; // 保留空白并允许换行
    element.style.wordWrap = 'break-word'; // 允许长单词换行
    element.innerText = text;

    document.body.appendChild(element);
    const height = element.offsetHeight;
    document.body.removeChild(element);

    return height;
  }
  const height = calculateTextHeight(str, width, fontSize);
  if (height > maxHeight) {
    return { width, height: maxHeight };
  } else if (height < minHeight) {
    return { width, height: minHeight };
  }
  return { width, height };
};
