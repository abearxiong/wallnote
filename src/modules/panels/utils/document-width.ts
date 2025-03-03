export const getDocumentWidth = () => {
  return document.documentElement.clientWidth;
};

export const getDocumentHeight = () => {
  return document.documentElement.clientHeight;
};

export const getDocumentWidthAndHeight = () => {
  return {
    width: getDocumentWidth(),
    height: getDocumentHeight(),
  };
};
