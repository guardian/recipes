/** @jsxImportSource @emotion/react */
import { ActionType, SchemaItem, Timing } from 'interfaces/main';
import { Dispatch } from 'react';
import { getItemButtons } from '../form-buttons';
import { getFormFieldsSchema } from '../form-group';
import FormItem from '../form-item';

export const renderTimingsFormGroup = (
	formItems: Timing,
	schema: SchemaItem,
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
					k === 'qualifier'
						? [
								'prep-time',
								'cook-time',
								'set-time',
								'marinate-time',
								'soak-time',
								'chill-time',
								'freeze-time',
								'infuse-time',
								'rest-time',
								'prove-time',
						  ]
						: null
				}
				label={`${key}.${k}`}
				key={`${key}.${k}`}
				dispatcher={dispatcher}
			/>
		);
	});
	return [
		<div
			css={{
				display: 'flex !important',
				fontFamily: 'GuardianTextSans',
				fontSize: '1.0625rem',
				justifyContent: 'top',
			}}
		>
			{fields} minutes
			{formItemButtons}
		</div>,
	];
};
