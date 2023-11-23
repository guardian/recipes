/** @jsxImportSource @emotion/react */

import { getProxyPath } from '../../utils/proxy';

export default ({
	articlePath: capiId,
}: {
	articlePath: string;
}): JSX.Element => {
	const proxyPath = getProxyPath('/' + capiId);
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
