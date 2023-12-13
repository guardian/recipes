import { RecipeListType } from './recipe-list';

interface RecipesOverviewProps {
	recipesList: RecipeListType[];
}

export const RecipesOverview = ({ recipesList }: RecipesOverviewProps) => {
	const appReadyRecipes = recipesList.filter((recipe) => recipe.isAppReady);

	const chefs = [
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
	];

	const getAuthorCount = (contributorTag: string) => {
		return appReadyRecipes.reduce(
			(acc, recipe) =>
				recipe.contributors.includes(contributorTag) ? ++acc : acc,
			0,
		);
	};
	const authorSummaryCard = (name: string, contributorTag: string) => {
		const count = getAuthorCount(contributorTag);
		const percentageOfAllRecipes = (count / appReadyRecipes.length) * 100;
		return (
			<>
				<div>
					{name}: {getAuthorCount(contributorTag)} ({percentageOfAllRecipes}%)
				</div>
			</>
		);
	};
	return (
		<>
			<h2>{appReadyRecipes.length} app-ready recipes</h2>
			{chefs.map((chef) => authorSummaryCard(chef.name, chef.contributorTag))}
		</>
	);
};
