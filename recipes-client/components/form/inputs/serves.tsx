/** @jsxImportSource @emotion/react */

import { ActionType, SchemaItem, Serves } from 'interfaces/main';
import { servesSchema } from 'interfaces/nastyHardcodedSchemas';
import { Dispatch } from 'react';
import { isRangeField } from 'utils/recipe-field-checkers';
import { getItemButtons } from '../form-buttons';
import FormItem from '../form-item';
import { renderRangeFormGroup } from './range';

export const renderServesFormGroup = (
	formItems: Serves,
	schema: SchemaItem,
	choices: string[] | null,
	key: string,
	dispatcher: Dispatch<ActionType>,
) => {
	const formFieldsSchema = servesSchema;
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

	const fields = Object.keys(formItems).map((k: keyof Serves) => {
		if (isRangeField(formItems[k])) {
			return renderRangeFormGroup(
				formItems[k],
				choices,
				`${key}.${k}`,
				dispatcher,
			);
		}
		return (
			<FormItem
				text={formItems[k]}
				choices={null}
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
