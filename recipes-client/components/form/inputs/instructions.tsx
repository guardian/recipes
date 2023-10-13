/** @jsxImportSource @emotion/react */

import { Legend } from '@guardian/source-react-components';
import { ActionType, Instruction } from 'interfaces/main';
import { Dispatch } from 'react';
import FormItem from '../form-item';

export const renderInstructionsFormGroup = (
	formItems: Instruction[],
	choices: string[] | null,
	key: string,
	dispatcher: Dispatch<ActionType>,
) => {
	const fields = Object.keys(formItems).map((k: keyof Instruction) => {
		if (k === 'images') {
			const images = formItems[k] as string[];
			const imageInputs = images.map((image) => {
				return (
					<FormItem
						text={image}
						choices={choices}
						label={k}
						key={`${key}.${k}`}
						dispatcher={dispatcher}
					/>
				);
			});
			return [
				<fieldset key={`${key}.fieldset`} css={{}}>
					<Legend key={`${key}.legend`} text={key}></Legend>
					{imageInputs}
				</fieldset>,
			];
		}
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
		<fieldset key={`${key}.fieldset`} css={{}}>
			<Legend key={`${key}.legend`} text={key}></Legend>
			{fields}
		</fieldset>,
	];
};
