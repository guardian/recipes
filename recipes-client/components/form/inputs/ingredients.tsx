/** @jsxImportSource @emotion/react */
import {
	ActionType,
	Ingredient,
	IngredientsGroup,
	SchemaItem,
} from 'interfaces/main';
import { Dispatch } from 'react';
import { isRangeField } from 'utils/recipe-field-checkers';
import { getItemButtons } from '../form-buttons';
import FormItem from '../form-item';
import { renderRangeFormGroup } from './range';
import { actions } from 'actions/recipeActions';
import { getFormFieldsSchema } from '../form-group';
import { css } from '@emotion/react';

export const renderIngredientsFormGroup = (
	formItems: IngredientsGroup,
	schema: SchemaItem,
	choices: string[] | null,
	key: string,
	dispatcher: Dispatch<ActionType>,
) => {
	const formFieldsSchema = getFormFieldsSchema(schema);
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
			let ingredientsList = formItems[k] as Ingredient[];
			const prefix = `${key}.${k}`;
			const listInputs = ingredientsList.map((ingredient, i) => {
				const formFieldsSchema = getFormFieldsSchema(schema);
				const formItemAddId = `${prefix}.${i + 1}`;
				const formItemRemove = `${prefix}.${i}`;
				const formItemButtons = getItemButtons(
					`${prefix}.${i}`,
					formItemAddId,
					formItemRemove,
					formFieldsSchema,
					dispatcher,
				);

				const updateAmount = (
					key: string,
					dispatcher: Dispatch<ActionType>,
				): void => {
					dispatcher({
						type: actions.change,
						payload: { [key]: { min: 0, max: 0 } },
					});
				};

				const fields = Object.keys(displayOrder)
					.sort((a, b) => displayOrder[a] - displayOrder[b])
					.map((k: keyof Ingredient) => {
						if (isRangeField(ingredient[k])) {
							return renderRangeFormGroup(
								ingredient[k],
								choices,
								`${prefix}.${i}.${k}`,
								dispatcher,
							);
						} else if (k === 'amount') {
							return (
								<div
									css={{
										width: '120px',
										height: '27px',
										fontFamily: 'GuardianTextSans',
										alignSelf: 'end',
										border: '1px solid black',
										padding: '8px',
										margin: '4px',
										marginLeft: '2px',
										borderRadius: '4px',
										textAlign: 'center',
										cursor: 'pointer',
										backgroundColor: '#052962',
										color: 'white',
									}}
									onClick={() =>
										updateAmount(`${prefix}.${i}.${k}`, dispatcher)
									}
								>
									Add amount
								</div>
							);
						} else
							return (
								<div
									css={{
										display: 'grid',
										fontFamily: 'GuardianTextSans',
										color: 'gray',
										fontSize: '0.9rem',
									}}
								>
									{k}
									<FormItem
										text={ingredient[k] || ''}
										choices={choices}
										label={`${prefix}.${i}.${k}`}
										key={`${prefix}.${i}.${k}`}
										dispatcher={dispatcher}
									/>
								</div>
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
		<div
			css={css`
				overflow-x: scroll;
				overflow-y: auto;
				transform: rotateX(180deg);
				margin-bottom: 20px;
			`}
		>
			<div
				css={css`
					transform: rotateX(180deg);
				`}
			>
				{fields}
				{formItemButtons}
			</div>
		</div>,
	];
};

const displayOrder = {
	name: 1,
	amount: 2,
	unit: 3,
	prefix: 4,
	suffix: 5,
	text: 6,
	optional: 7,
};
