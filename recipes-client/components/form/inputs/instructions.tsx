/** @jsxImportSource @emotion/react */

import { ActionType, Instruction, SchemaItem } from 'interfaces/main';
import { ChangeEvent, Dispatch, useEffect, useState } from 'react';
import { getItemButtons } from '../form-buttons';
import { getFormFieldsSchema } from '../form-group';
import FormItem from '../form-item';

export const renderInstructionsFormGroup = (
	formItems: Instruction[],
	schema: SchemaItem,
	choices: string[] | null,
	key: string,
	dispatcher: Dispatch<ActionType>,
	toggleInstructionsToMerge: (
		event: ChangeEvent<HTMLInputElement>,
		step: Instruction[],
		key: string,
	) => void,
	checkedFields: Record<string, boolean>,
	setCheckedFields: (value: React.SetStateAction<{}>) => void,
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
			<input
				type="checkbox"
				id={key}
				style={{
					width: '25px',
					height: '25px',
					marginRight: '10px',
					alignSelf: 'center',
				}}
				checked={checkedFields[key] || false}
				onChange={(e) => {
					setCheckedFields({ ...checkedFields, [key]: e.target.checked }); // Update state
					toggleInstructionsToMerge(e, formItems, key);
				}}
			/>
			{fields}
			{formItemButtons}
		</div>,
	];
};

const displayOrder = { stepNumber: 1, description: 2, images: 3 };
