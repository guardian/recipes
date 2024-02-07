/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { headline, palette } from '@guardian/source-foundations';

const Header = (): JSX.Element => {
	return (
		<header
			css={css`
				${headline.small()};
				text-align: center;
				padding: 2rem 0;
				background-color: ${palette.brand[400]};
				a {
					text-decoration: none;
					color: ${palette.neutral[100]};
					padding: 2rem 0;
					:hover {
						opacity: 0.8;
					}
				}
				h2 {
					margin: 0;
				}
			`}
		>
			<a href="/">
				<h2>Hatch</h2>
				<span>Formerly a (temporary) recipe data curation tool</span>
			</a>
		</header>
	);
};

export default Header;
