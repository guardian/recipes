import { Legend } from '@guardian/source-react-components';
import { ActionType, Serves } from 'interfaces/main';
import { Dispatch } from 'react';
import { isRangeField } from 'utils/recipe-field-checkers';
import FormItem from '../form-item';
import { renderRangeFormGroup } from './range';

export const renderServesFormGroup = (
	formItems: Serves,
	choices: string[] | null,
	key: string,
	dispatcher: Dispatch<ActionType>,
) => {
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
		</fieldset>,
	];
};
