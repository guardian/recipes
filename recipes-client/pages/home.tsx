/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { WelcomeExplainer } from 'components/dashboard/welcome-explainer';

const Home = (): JSX.Element => {
	return (
		<div css={mainContainerStyles}>
			<div
				css={css`
					position: absolute;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
				`}
			>
				<WelcomeExplainer />
			</div>
		</div>
	);
};
export default Home;

const mainContainerStyles = css`
	padding: 20px;
`;
