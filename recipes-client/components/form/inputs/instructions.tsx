/** @jsxImportSource @emotion/react */

import { ActionType, Instruction, SchemaItem } from 'interfaces/main';
import { Dispatch } from 'react';
import { getItemButtons } from '../form-buttons';
import { getFormFieldsSchema } from '../form-group';
import FormItem from '../form-item';

export const renderInstructionsFormGroup = (
	formItems: Instruction[],
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
	const fields = Object.keys(formItems)
		.sort((a, b) => displayOrder[a] - displayOrder[b])
		.map((k: keyof Instruction) => {
			if (k === 'images') {
				return null;
			}
			return (
				<FormItem
					text={formItems[k]}
					choices={choices}
					label={`${key}.${k}`}
					key={`${key}.${k}`}
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
};

const displayOrder = { stepNumber: 1, description: 2, images: 3 };
