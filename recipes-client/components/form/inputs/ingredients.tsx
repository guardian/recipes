import { Legend } from '@guardian/source-react-components';
import {
	ActionType,
	Ingredient,
	IngredientsGroup,
	schemaItem,
} from 'interfaces/main';
import { Dispatch } from 'react';
import { isRangeField } from 'utils/recipe-field-checkers';
import { getFormFieldsSchema, getItemButtons } from '../form-group';
import FormItem from '../form-item';
import { renderRangeFormGroup } from './range';

export const renderIngredientsFormGroup = (
	formItems: IngredientsGroup,
	schema: schemaItem,
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
				const formFieldsSchema = getFormFieldsSchema(formItems, schema);
				const formItemAddId = key;
				const formItemRemoveLastId =
					key.slice(0, -1) + (parseInt(key.slice(-1)) - 1).toString();
				const formItemButtons = getItemButtons(
					key,
					formItemAddId,
					formItemRemoveLastId,
					formFieldsSchema,
					dispatcher,
				);
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
						{formItemButtons}
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
