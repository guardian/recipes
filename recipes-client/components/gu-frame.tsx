/** @jsxImportSource @emotion/react */

import { getProxyPath } from '../utils/proxy';

export default (props: { articlePath: string }): JSX.Element => {
	// Workaround until we remove recipe number from path
	const trimmedPath = props.articlePath.slice(0, -2);
	const proxyPath = getProxyPath(trimmedPath);
	return (
		<iframe
			css={{
				border: 'solid lightgray 2px',
				borderWidth: '30px 20px 60px 20px',
				borderRadius: '10px',
				width: '90%',
				height: '90%',
			}}
			src={proxyPath}
		></iframe>
	);
};
