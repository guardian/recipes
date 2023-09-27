const getProxyPath = (path: string): string => {
	const cleanPath = path.charAt(0) === '/' ? path.substr(1) : path;

	return `/proxy/${cleanPath}#noads`;
};

const getCAPIPath = (path: string): string => {
	const cleanPath = path.charAt(0) === '/' ? path.substr(1) : path;

	return `/api/capi/${cleanPath}`;
};

export { getProxyPath, getCAPIPath };
