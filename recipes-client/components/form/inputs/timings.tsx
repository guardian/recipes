/** @jsxImportSource @emotion/react */
import { Legend } from '@guardian/source-react-components';
import { ActionType, schemaItem, Timing } from 'interfaces/main';
import { Dispatch } from 'react';
import { getFormFieldsSchema, getItemButtons } from '../form-group';
import FormItem from '../form-item';

export const renderTimingsFormGroup = (
	formItems: Timing,
	schema: schemaItem,
	choices: string[] | null,
	key: string,
	dispatcher: Dispatch<ActionType>,
) => {
	const formFieldsSchema = {
		type: 'object',
		properties: {
			qualifier: {
				type: 'string',
			},
			durationInMins: {
				type: 'integer',
			},
		},
		required: ['qualifier', 'durationInMins'],
	};
	const formItemAddId = key;
	// Same as formItemAddId but convert last char to int and subtract 1
	const formItemRemoveLastId =
		key.slice(0, -1) + (parseInt(key.slice(-1)) - 1).toString();

	const formItemButtons = getItemButtons(
		key,
		formItemAddId,
		formItemRemoveLastId,
		formFieldsSchema,
		dispatcher,
	);
	const fields = Object.keys(formItems).map((k: keyof Timing) => {
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
		<fieldset key={`${key}.fieldset`} css={{}}>
			<Legend key={`${key}.legend`} text={key}></Legend>
			{fields}
			{formItemButtons}
		</fieldset>,
	];
};
