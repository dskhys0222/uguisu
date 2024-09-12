export const getDeviceType = () => {
  const userAgent = navigator.userAgent.toLowerCase();

  if (userAgent.includes("mobile")) {
    return "スマホ";
  }

  if (
    userAgent.includes("tablet") ||
    userAgent.includes("ipad") ||
    (userAgent.includes("android") && !userAgent.includes("mobile"))
  ) {
    return "タブレット";
  }

  return "PC";
};
