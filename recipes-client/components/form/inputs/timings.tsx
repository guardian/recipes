/** @jsxImportSource @emotion/react */
import { Legend } from '@guardian/source-react-components';
import { ActionType, Timing } from 'interfaces/main';
import { Dispatch } from 'react';
import FormItem from '../form-item';

export const renderTimingsFormGroup = (
	formItems: Timing,
	choices: string[] | null,
	key: string,
	dispatcher: Dispatch<ActionType>,
) => {
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
		</fieldset>,
	];
};
