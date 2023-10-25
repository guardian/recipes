import { Legend } from '@guardian/source-react-components';
import { ActionType, Ingredient, IngredientsGroup } from 'interfaces/main';
import { Dispatch } from 'react';
import { isRangeField } from 'utils/recipe-field-checkers';
import FormItem from '../form-item';
import { renderRangeFormGroup } from './range';

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
					label={`${key}.${k}`}
					key={`${key}.${k}`}
					dispatcher={dispatcher}
				/>
			);
		else {
			const ingredientsList = formItems[k] as Ingredient[];
			const prefix = `${key}.${k}`;
			const listInputs = ingredientsList.map((ingredient, i) => {
				const fields = Object.keys(ingredient).map((k: keyof Ingredient) => {
					if (isRangeField(ingredient[k])) {
						return renderRangeFormGroup(
							ingredient[k],
							choices,
							`${prefix}.${i}.${k}`,
							dispatcher,
						);
					} else
						return (
							<FormItem
								text={ingredient[k]}
								choices={choices}
								label={`${prefix}.${i}.${k}`}
								key={`${prefix}.${i}.${k}`}
								dispatcher={dispatcher}
							/>
						);
				});
				return [
					<fieldset key={`${key}.fieldset`}>
						<Legend key={`${key}.legend`} text={`${key}.${k}`}></Legend>
						{fields}
					</fieldset>,
				];
			});
			return listInputs;
		}
	});
	return [
		<fieldset key={`${key}.fieldset`}>
			<Legend key={`${key}.legend`} text={key}></Legend>
			{fields}
		</fieldset>,
	];
};
