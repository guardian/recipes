/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { palette } from '@guardian/source-foundations';
import { Radio, RadioGroup } from '@guardian/source-react-components';
import { RecipesOverview } from 'components/dashboard/recipes-overview';
import { useEffect, useState } from 'react';
import RecipeList, {
	RecipeListType,
} from '../components/dashboard/recipe-list';
import { listEndpoint } from '../consts/index';

const Home = (): JSX.Element => {
	const [recipeList, setList] = useState<RecipeListType[]>([]);
	const [displayedRecipes, setDisplayedRecipes] = useState<RecipeListType[]>(
		[],
	);
	const [listFilter, setListFilter] = useState<
		'all' | 'app-ready' | 'edited-but-not-app-ready' | 'non-curated'
	>('all');

	useEffect(() => {
		const recipes = recipeList.filter((recipe) => {
			if (listFilter === 'all') {
				return true;
			} else if (listFilter === 'app-ready') {
				return recipe.isAppReady;
			} else if (listFilter === 'edited-but-not-app-ready') {
				return !recipe.isAppReady && recipe.isInCuratedTable;
			} else if (listFilter === 'non-curated') {
				return !recipe.isAppReady && !recipe.isInCuratedTable;
			} else {
				console.error('Invalid filter');
				return true;
			}
		});
		setDisplayedRecipes(recipes);
	}, [recipeList, listFilter]);

	useEffect(() => {
		fetch(listEndpoint)
			.then((response) => response.json())
			.then((data) => setList(data))
			.catch(() => null);
	}, []);

	const counterStyles = css`
		position: fixed;
		top: 0;
		right: 0;
		background-color: ${palette.brandAlt[300]};
		padding: 10px;
		font-size: 1.2rem;
		font-weight: bold;
		color: #121212;
		border-bottom-left-radius: 5px;
		z-index: 1;
	`;

	return (
		<div css={mainContainerStyles}>
			<div css={counterStyles}>
				<div>
					<span>{recipeList.filter((recipe) => recipe.isAppReady).length}</span>{' '}
					app-approved recipes and counting
				</div>
			</div>
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
			<RecipesOverview recipesList={recipeList} />
			<hr />
			<div>
				<RadioGroup orientation="horizontal" label="Filter displayed recipes">
					<Radio
						name="filter"
						value="all"
						label="All"
						onChange={() => setListFilter('all')}
						checked={listFilter === 'all'}
					/>
					<Radio
						name="filter"
						value="app-ready"
						label="App-approved"
						onChange={() => setListFilter('app-ready')}
						checked={listFilter === 'app-ready'}
					/>
					<Radio
						name="filter"
						value="edited-but-not-app-ready"
						label="Edited but not app-approved"
						onChange={() => setListFilter('edited-but-not-app-ready')}
						checked={listFilter === 'edited-but-not-app-ready'}
					/>
					<Radio
						name="filter"
						value="non-curated"
						label="Awaiting curation"
						onChange={() => setListFilter('non-curated')}
						checked={listFilter === 'non-curated'}
					/>
				</RadioGroup>
			</div>
			{recipeList.length > 0 && (
				<div>
					<RecipeList list={displayedRecipes} />
				</div>
			)}
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
