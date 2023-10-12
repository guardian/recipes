/** @jsxImportSource @emotion/react */
import { Legend } from '@guardian/source-react-components';
import { ActionType, Ingredient, IngredientsGroup } from 'interfaces/main';
import { Dispatch } from 'react';
import FormItem from '../form-item';

export const renderIngredientsFormGroup = (
	formItems: IngredientsGroup,
	choices: string[] | null,
	key: string,
	dispatcher: Dispatch<ActionType>,
) => {
	const fields = Object.keys(formItems).map((k: keyof IngredientsGroup) => {
		if (k === 'recipeSection')
			return (
				<FormItem
					text={formItems[k]}
					choices={choices}
					label={k}
					key={`${key}.${k}`}
					dispatcher={dispatcher}
				/>
			);
		else {
			const ingredientsList = formItems[k] as Ingredient[];
			const listInputs = ingredientsList.map((ingredient) => {
				const fields = Object.keys(ingredient).map((k: keyof Ingredient) => {
					if (k === 'amount') {
						const range = ingredient[k];
						const rangeFields = Object.keys(range).map((k: keyof Range) => {
							return (
								<FormItem
									text={range[k]}
									choices={choices}
									label={k}
									key={`${key}.${k}`}
									dispatcher={dispatcher}
								/>
							);
						});
						return [
							<fieldset key={`${key}.fieldset`} css={{}}>
								<Legend key={`${key}.legend`} text={key}></Legend>
								{rangeFields}
							</fieldset>,
						];
					} else
						return (
							<FormItem
								text={ingredient[k]}
								choices={choices}
								label={k}
								key={`${key}.${k}`}
								dispatcher={dispatcher}
							/>
						);
				});
				return [
					<fieldset key={`${key}.fieldset`} css={{}}>
						<Legend key={`${key}.legend`} text={key}></Legend>
						{fields}
					</fieldset>,
				];
			});
			return listInputs;
		}
	});
	return [
		<fieldset key={`${key}.fieldset`} css={{}}>
			<Legend key={`${key}.legend`} text={key}></Legend>
			{fields}
		</fieldset>,
	];
};
