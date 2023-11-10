/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState } from 'react';
import RecipeList from '../components/recipe-list';
import { listEndpoint } from '../consts/index';

const Home = (): JSX.Element => {
	const [recipeList, setList] = useState(null);
	fetch(listEndpoint)
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			setList(data);
		})
		.catch(() => {
			return null;
		});

	return (
		<div css={mainContainerStyles}>
			<div css={explainerStyles}>
				<h2>This is it how it works:</h2>
				<ul>
					<li>Pick a recipe.</li>
					<li>Edit it.</li>
					<li>Save it.</li>
				</ul>
				<div>
					Read the{' '}
					<a
						href="https://docs.google.com/document/d/1wrVUX7vVTLBd0fxqDbQxqmyXoY4Vvyw5aX79tMxROhk/edit#heading=h.7n6l8nswve9p"
						target="_blank"
					>
						recipe data curation guide
					</a>{' '}
					for a more in-depth breakdown.
				</div>
			</div>
			{recipeList !== null && <RecipeList list={recipeList} />}
		</div>
	);
};
export default Home;

const mainContainerStyles = css`
	padding: 20px;
`;

const explainerStyles = css`
	margin-bottom: 30px;
`;
