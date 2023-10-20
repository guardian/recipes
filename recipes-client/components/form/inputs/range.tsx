import { Legend } from '@guardian/source-react-components';
import { ActionType } from 'interfaces/main';
import { Dispatch } from 'react';
import FormItem from '../form-item';

export const renderRangeFormGroup = (
	formItems: Range,
	choices: string[] | null,
	key: string,
	dispatcher: Dispatch<ActionType>,
) => {
	const fields = Object.keys(formItems).map((k: keyof Range) => {
		return (
			<FormItem
				text={formItems[k]}
				choices={choices}
				label={k}
				key={`${key}.${k}`}
				dispatcher={dispatcher}
			/>
		);
	});
	return [
		<fieldset key={`${key}.fieldset`}>
			<Legend key={`${key}.legend`} text={key}></Legend>
			{fields}
		</fieldset>,
	];
};
