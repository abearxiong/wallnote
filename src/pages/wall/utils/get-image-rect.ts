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
