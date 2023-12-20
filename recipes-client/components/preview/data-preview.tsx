/** @jsxImportSource @emotion/react */
import { AllRecipeFields } from 'interfaces/main';
import { css } from '@emotion/react';
import { CheckedSymbol } from '../reusables/app-ready-status';
import { palette } from '@guardian/source-foundations';
import {
  prettifyDurationInMins,
  prettifyRange,
  renderIngredientAsSentence,
} from './prettifiers';

interface DataPreviewProps {
  recipeData: AllRecipeFields | null;
}

export const DataPreview = ({ recipeData }: DataPreviewProps) => {
  const plainTextPreview = (label: string, content: string | undefined) => {
    const displayedContent = content && content.length > 0 ? content : '-';
    return (
      <div>
        <small>{label}</small>
        <div>{displayedContent}</div>
      </div>
    );
  };

  const stringListPreview = (label: string, content: string[]) => {
    return (
      <div>
        <small>{label}</small>
        {content.length > 0 ? (
          <ul>
            {content.map((item, i) => {
              return <li key={i}>{item}</li>;
            })}
          </ul>
        ) : (
          <div>-</div>
        )}
      </div>
    );
  };
  return recipeData === null ? (
    <div>Recipe data could not be loaded.</div>
  ) : (
    <div css={previewStyles}>
      <div>
        <small>Marked app-ready</small>
        <div>
          <CheckedSymbol isAppReady={recipeData.isAppReady} />
        </div>
      </div>
      {plainTextPreview('Recipe ID', recipeData.id)}
      <div>
        <small>Canonical article</small>
        <div>
          <a
            href={`https://theguardian.com/${recipeData.canonicalArticle}`}
            target="_blank"
          >
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
      {plainTextPreview('Book credit', recipeData.bookCredit)}
      {plainTextPreview('Title', recipeData.title)}
      {plainTextPreview('Description', recipeData.description)}
      {stringListPreview('Contributor(s)', recipeData.contributors)}
      {stringListPreview('Byline(s)', recipeData.byline)}
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
              <li key={i}>
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
          {recipeData.ingredients.map((ingredientGroup, i) => {
            return (
              <li key={i}>
                {ingredientGroup.recipeSection}
                <ul>
                  {ingredientGroup.ingredientsList.map((ingredient, i) => {
                    return (
                      <li key={i}>{renderIngredientAsSentence(ingredient)}</li>
                    );
                  })}
                </ul>
              </li>
            );
          })}
        </ul>
      </div>
      {stringListPreview('Diets', recipeData.suitableForDietIds)}
      {stringListPreview('Cuisines', recipeData.cuisineIds)}
      {stringListPreview('Meal types', recipeData.mealTypeIds)}
      {stringListPreview('Celebrations', recipeData.celebrationIds)}
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
