export const isMac = async () => {
  // Check if the newer API is available
  const navigator = window.navigator as Navigator & { userAgentData: { getHighEntropyValues: (keys: string[]) => Promise<{ platform: string }> } };
  if (navigator.userAgentData) {
    const uaData = await navigator.userAgentData.getHighEntropyValues(['platform']);
    return uaData.platform === 'macOS';
  } else {
    // Fallback to using the older userAgent string
    return /Macintosh|Mac OS X/i.test(navigator.userAgent);
  }
};
