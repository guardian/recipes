/** @jsxImportSource @emotion/react */

import { getProxyPath } from '../utils/proxy';

export default (props: { articlePath: string }): JSX.Element => {
	const proxyPath = getProxyPath(props.articlePath);
	return (
		<iframe
			css={{ border: 'none', width: '100%', height: '100%' }}
			src={proxyPath}
		></iframe>
	);
};
