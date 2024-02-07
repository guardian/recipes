/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { textSans } from '@guardian/source-foundations';

export const WelcomeExplainer = () => {
	return (
		<div
			css={css`
				${textSans.medium()};
				margin: 0 auto;
				li {
					margin-bottom: 10px;
				}
			`}
		>
			<h2>Welcome to Hatch! Now, please leave Hatch.</h2>
			<p>
				The altogether more functional, stylish, and dignified{' '}
				<a href="https://composer.gutools.co.uk/">Composer</a> is the new home
				of recipe data curation.
			</p>
			<p>To create a recipe in Composer:</p>
			<ul>
				<li>Open a recipe article (ensuring it has a 'tone/recipes' tag)</li>
				<li>Highlight the content of the recipe you want to structure</li>
				<li>Click the 'Create Recipe' button that appears</li>
				<li>Curate and save</li>
			</ul>
			<p>
				Hatch itself may yet return as a recipe data summary dashboard, but for
				now it's time to say goodbye.
			</p>
		</div>
	);
};
