/** @jsxImportSource @emotion/react */
import { Legend } from '@guardian/source-react-components';
import { ActionType, schemaItem, Timing } from 'interfaces/main';
import { Dispatch } from 'react';
import { getItemButtons } from '../form-buttons';
import { getFormFieldsSchema } from '../form-group';
import FormItem from '../form-item';

export const renderTimingsFormGroup = (
	formItems: Timing,
	schema: schemaItem,
	choices: string[] | null,
	key: string,
	dispatcher: Dispatch<ActionType>,
) => {
	const formFieldsSchema = getFormFieldsSchema(formItems, schema);
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
	const fields = Object.keys(formItems).map((k: keyof Timing) => {
		return (
			<FormItem
				text={formItems[k]}
				choices={
					k === 'qualifier' ? ['prep-time', 'cook-time', 'set-time'] : null
				}
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
