const getProxyPath = (path: string): string => {
  const cleanPath = path.charAt(0) === "/" ? path.substr(1) : path;

  return `/proxy/${cleanPath}#noads`;
};

export { getProxyPath };
