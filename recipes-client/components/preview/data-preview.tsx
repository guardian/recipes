/** @jsxImportSource @emotion/react */
import { AllRecipeFields, Ingredient } from 'interfaces/main';
import { css } from '@emotion/react';
import { AppReadyStatus } from '../reusables/app-ready-status';
import { Range } from 'interfaces/main';
import { palette } from '@guardian/source-foundations';

interface DataPreviewProps {
	recipeData: AllRecipeFields | null;
}

const prettifyRange = (amount: Range) => {
	return amount.min === amount.max ? amount.min : `${amount.min}-${amount.max}`;
};

const prettifyDurationInMins = (durationInMins: number): string => {
	const hours = Math.floor(durationInMins / 60);
	const mins = durationInMins % 60;
	return `${hours > 0 ? `${hours}h` : ''} ${mins > 0 ? `${mins}m` : ''}`;
};

export const DataPreview = ({ recipeData }: DataPreviewProps) => {
	const renderIngredientAsSentence = ({
		name,
		amount,
		unit,
		prefix,
		suffix,
	}: Ingredient) => {
		const concernsTins = unit?.includes('tin');
		const tbsOrTsp = unit?.includes('tbsp') || unit?.includes('tsp');
		return `${amount ? prettifyRange(amount) : ''}${tbsOrTsp ? ' ' : ''}${
			concernsTins ? ' x ' : ''
		}${unit ? unit : ''} ${prefix ? prefix : ''} ${name} ${
			suffix ? suffix : ''
		}`;
	};

	return recipeData === null ? (
		<div>Recipe data could not be loaded.</div>
	) : (
		<div css={previewStyles}>
			<div>
				<small>Marked app-ready</small>
				<div>
					<AppReadyStatus isAppReady={recipeData.isAppReady} />
				</div>
			</div>
			<div>
				<small>Recipe ID</small>
				<div>{recipeData.id}</div>
			</div>
			<div>
				<small>Canonical article</small>
				<div>
					<a href={recipeData.canonicalArticle} target="_blank">
						{recipeData.canonicalArticle}
					</a>
				</div>
			</div>
			<div>
				<small>Featured image</small>
				<div>
					{recipeData.featuredImage ? (
						<img
							src={recipeData.featuredImage.url}
							alt={`Featured image of ${recipeData.title} recipe`}
							css={imageStyles}
						/>
					) : (
						'-'
					)}
				</div>
			</div>
			<div>
				<small>Title</small>
				<div>{recipeData.title}</div>
			</div>
			<div>
				<small>Description</small>
				<div>
					{recipeData.description.length > 0 ? recipeData.description : '-'}
				</div>
			</div>
			<div>
				<small>Contributor(s)</small>
				<div>
					{recipeData.contributors.length > 0
						? recipeData.contributors.join(', ')
						: '-'}
				</div>
			</div>
			<div>
				<small>Byline(s)</small>
				<div>
					{recipeData.byline.length > 0 ? recipeData.byline.join(', ') : '-'}
				</div>
			</div>
			<div>
				<small>Serves</small>
				<ul>
					{recipeData.serves?.map((serves, i) => {
						return (
							<li key={i}>
								{prettifyRange(serves.amount)} {serves.unit}
							</li>
						);
					})}
				</ul>
			</div>
			<div>
				<small>Timings</small>
				<ul>
					{recipeData.timings.map((timing, i) => {
						return (
							<li key={i}>
								<strong>{timing.qualifier}</strong>:{' '}
								{prettifyDurationInMins(timing.durationInMins)}
							</li>
						);
					})}
				</ul>
			</div>
			<div>
				<small>Method</small>
				<ul>
					{recipeData.instructions.map((instruction, i) => {
						return (
							<li>
								<strong>{instruction.stepNumber}.</strong>{' '}
								{instruction.description}
							</li>
						);
					})}
				</ul>
			</div>
			<div>
				<small>Ingredients</small>
				<ul>
					{recipeData.ingredients.map((ingredient, i) => {
						return (
							<>
								<li key={i}>{ingredient.recipeSection}</li>
								<ul>
									{ingredient.ingredientsList.map((ingredient, i) => {
										return (
											<li key={i}>{renderIngredientAsSentence(ingredient)}</li>
										);
									})}
								</ul>
							</>
						);
					})}
				</ul>
			</div>
			<div>
				<small>Diets</small>
				{recipeData.suitableForDietIds.length === 0 ? (
					<div>-</div>
				) : (
					<ul>
						{recipeData.suitableForDietIds.map((diet, i) => {
							return <li key={i}>{diet}</li>;
						})}
					</ul>
				)}
			</div>
			<div>
				<small>Cuisines</small>
				{recipeData.cuisineIds.length === 0 ? (
					<div>-</div>
				) : (
					<ul>
						{recipeData.cuisineIds.map((cuisine, i) => {
							return <li key={i}>{cuisine}</li>;
						})}
					</ul>
				)}
			</div>
			<div>
				<small>Meal types</small>
				{recipeData.mealTypeIds.length === 0 ? (
					<div>-</div>
				) : (
					<ul>
						{recipeData.mealTypeIds.map((mealType, i) => {
							return <li key={i}>{mealType}</li>;
						})}
					</ul>
				)}
			</div>
			<div>
				<small>Celebrations</small>
				{recipeData.celebrationIds.length === 0 ? (
					<div>-</div>
				) : (
					<ul>
						{recipeData.celebrationIds.map((celebration, i) => {
							return <li key={i}>{celebration}</li>;
						})}
					</ul>
				)}
			</div>
		</div>
	);
};

const previewStyles = css`
	h3 {
		margin-top: 0;
	}
	small {
		background-color: ${palette.neutral[86]};
		padding: 0.25rem;
		border-radius: 0.25rem;
		display: inline-block;
		margin-bottom: 0.25rem;
	}
	li {
		margin-bottom: 0.5rem;
	}
	div {
		margin-bottom: 1rem;
	}
`;

const imageStyles = css`
	max-width: 50%;
	height: auto;
`;
