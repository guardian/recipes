/** @jsxImportSource @emotion/react */
import {
	ActionType,
	Ingredient,
	IngredientsGroup,
	SchemaItem,
} from 'interfaces/main';
import {
	ingredientGroupSchema,
	ingredientSchema,
} from 'interfaces/nastyHardcodedSchemas';
import { Dispatch } from 'react';
import { isRangeField } from 'utils/recipe-field-checkers';
import { getItemButtons } from '../form-buttons';
import FormItem from '../form-item';
import { renderRangeFormGroup } from './range';

export const renderIngredientsFormGroup = (
	formItems: IngredientsGroup,
	schema: SchemaItem,
	choices: string[] | null,
	key: string,
	dispatcher: Dispatch<ActionType>,
) => {
	const formFieldsSchema = ingredientGroupSchema;
	const formItemAddId =
		key.slice(0, -1) + (parseInt(key.slice(-1)) + 1).toString();
	const formItemRemoveId = key;
	const formItemButtons = getItemButtons(
		key,
		formItemAddId,
		formItemRemoveId,
		formFieldsSchema,
		dispatcher,
	);
	const fields = Object.keys(formItems).map((k: keyof IngredientsGroup) => {
		if (k === 'recipeSection')
			return (
				<div css={{ display: 'flex' }}>
					<p css={{ fontFamily: 'GuardianTextSans', marginRight: '10px' }}>
						Recipe Section Name (if applicable):{' '}
					</p>
					<FormItem
						text={formItems[k]}
						choices={choices}
						label={`${key}.${k}`}
						key={`${key}.${k}`}
						dispatcher={dispatcher}
					/>
				</div>
			);
		else {
			const ingredientsList = formItems[k] as Ingredient[];
			const prefix = `${key}.${k}`;
			const listInputs = ingredientsList.map((ingredient, i) => {
				const formFieldsSchema = ingredientSchema;
				const formItemAddId = `${prefix}.${i + 1}`;
				const formItemRemove = `${prefix}.${i}`;
				const formItemButtons = getItemButtons(
					`${prefix}.${i}`,
					formItemAddId,
					formItemRemove,
					formFieldsSchema,
					dispatcher,
				);
				const fields = Object.keys(ingredient)
					.sort((a, b) => displayOrder[a] - displayOrder[b])
					.map((k: keyof Ingredient) => {
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
					<div css={{ display: 'flex !important' }}>
						{fields}
						{formItemButtons}
					</div>,
				];
			});
			return listInputs;
		}
	});
	return [
		<div>
			{fields}
			{formItemButtons}
		</div>,
	];
};

const displayOrder = {
	name: 1,
	amount: 2,
	prefix: 3,
	suffix: 4,
	unit: 5,
	text: 6,
	optional: 7,
};
