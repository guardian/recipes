/** @jsxImportSource @emotion/react */

import { Legend } from '@guardian/source-react-components';
import { ActionType, Instruction, schemaItem } from 'interfaces/main';
import { Dispatch } from 'react';
import { getFormFieldsSchema, getItemButtons } from '../form-group';
import FormItem from '../form-item';

export const renderInstructionsFormGroup = (
	formItems: Instruction[],
	schema: schemaItem,
	choices: string[] | null,
	key: string,
	dispatcher: Dispatch<ActionType>,
) => {
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
	const fields = Object.keys(formItems).map((k: keyof Instruction) => {
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
		<fieldset key={`${key}.fieldset`}>
			<Legend key={`${key}.legend`} text={key}></Legend>
			{fields}
			{formItemButtons}
		</fieldset>,
	];
};
