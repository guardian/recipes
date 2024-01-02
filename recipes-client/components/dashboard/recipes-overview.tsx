/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { RecipeListType } from './recipe-list';

interface RecipesOverviewProps {
	recipesList: RecipeListType[];
}

interface Chef {
	name: string;
	contributorTag: string;
}

interface RichChef extends Chef {
	recipeCount: number;
	percentOfAllRecipes: number;
}

export const RecipesOverview = ({ recipesList }: RecipesOverviewProps) => {
	const appReadyRecipes = recipesList.filter((recipe) => recipe.isAppReady);

	const chefs: Chef[] = [
		{
			name: 'Felicity Cloake',
			contributorTag: 'profile/felicity-cloake',
		},
		{
			name: 'Yotam Ottolenghi',
			contributorTag: 'profile/yotamottolenghi',
		},
		{
			name: 'Nigel Slater',
			contributorTag: 'profile/nigelslater',
		},
		{
			name: 'Meera Sodha',
			contributorTag: 'profile/meera-sodha',
		},
		{
			name: 'Anna Jones',
			contributorTag: 'profile/anna-jones',
		},
		{
			name: 'Thomasina Miers',
			contributorTag: 'profile/thomasina-miers',
		},
		{
			name: 'Nigella Lawson',
			contributorTag: 'profile/nigella-lawson',
		},
		{
			name: 'Rachel Roddy',
			contributorTag: 'profile/rachel-roddy',
		},
		{
			name: 'Benjamina Ebuehi',
			contributorTag: 'profile/benjamina-ebuehi',
		},
		{
			name: 'Ravneet Gill',
			contributorTag: 'profile/ravneet-gill',
		},
		{
			name: 'Jose Pizarro',
			contributorTag: 'profile/jose-pizarro',
		},
		{
			name: 'Rukmini Iyer',
			contributorTag: 'profile/rukmini-iyer',
		},
	];

	const richChefsObjectArray: RichChef[] = chefs
		.map((chef) => {
			const chefRecipeCount = appReadyRecipes.reduce(
				(acc, recipe) =>
					recipe.contributors.includes(chef.contributorTag) ? ++acc : acc,
				0,
			);
			const percentOfAllRecipes = Math.round(
				(chefRecipeCount / appReadyRecipes.length) * 100,
			);
			return {
				...chef,
				recipeCount: chefRecipeCount,
				percentOfAllRecipes: percentOfAllRecipes,
			};
		})
		.sort((a, b) => b.recipeCount - a.recipeCount)
		.filter((chef) => chef.recipeCount > 0);
	const countOfRecipesByOtherChefs = appReadyRecipes.reduce(
		(acc, recipe) =>
			recipe.contributors.some(
				(contributor) =>
					!chefs.map((chef) => chef.contributorTag).includes(contributor),
			)
				? ++acc
				: acc,
		0,
	);
	const renderChefSummaryCards = (chefs: RichChef[]) => {
		return chefs.map((chef) => {
			return (
				<div css={infoBoxStyles} key={chef.contributorTag}>
					<strong>{chef.name}:</strong> {chef.recipeCount} (
					{chef.percentOfAllRecipes}%)
				</div>
			);
		});
	};
	return (
		<>
			<h3>
				{appReadyRecipes.length} app-approved recipes, which break down as
				follows...
			</h3>
			<div
				css={css`
					display: flex;
					flex-direction: row;
					flex-wrap: wrap;
				`}
			>
				{renderChefSummaryCards(richChefsObjectArray)}
				<div css={infoBoxStyles}>
					<strong>Other chefs:</strong> {countOfRecipesByOtherChefs} (
					{Math.round(
						(countOfRecipesByOtherChefs / appReadyRecipes.length) * 100,
					)}
					%)
				</div>
			</div>
		</>
	);
};

const infoBoxStyles = css`
	padding: 10px;
	border: 1px solid #ccc;
	border-radius: 4px;
	margin-bottom: 10px;
	margin-right: 10px;
	max-width: 300px;
`;
