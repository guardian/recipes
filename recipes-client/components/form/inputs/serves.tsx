/** @jsxImportSource @emotion/react */

import { ActionType, SchemaItem, Serves } from 'interfaces/main';
import { Dispatch } from 'react';
import { isRangeField } from 'utils/recipe-field-checkers';
import { getItemButtons } from '../form-buttons';
import FormItem from '../form-item';
import { renderRangeFormGroup } from './range';
import { actions } from 'actions/recipeActions';
import { getFormFieldsSchema } from '../form-group';

export const renderServesFormGroup = (
	formItems: Serves,
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

	const updateAmount = (
		key: string,
		dispatcher: Dispatch<ActionType>,
	): void => {
		dispatcher({
			type: actions.change,
			payload: { [key]: { min: 1, max: 1 } },
		});
	};

	const fields = Object.keys(formItems).map((k: keyof Serves) => {
		if (isRangeField(formItems[k])) {
			return renderRangeFormGroup(
				formItems[k],
				choices,
				`${key}.${k}`,
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
					onClick={() => updateAmount(`${key}.${k}`, dispatcher)}
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
						text={formItems[k]}
						choices={null}
						label={`${key}.${k}`}
						key={`${key}.${k}`}
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
};
