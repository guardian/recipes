/** @jsxImportSource @emotion/react */

import { Legend } from '@guardian/source-react-components';
import { ActionType } from 'interfaces/main';
import { Dispatch } from 'react';
import FormItem from '../form-item';
import { css } from '@emotion/react';

export const renderRangeFormGroup = (
	formItems: Range,
	choices: string[] | null,
	key: string,
	dispatcher: Dispatch<ActionType>,
) => {
	const fields = Object.keys(formItems).map((k: keyof Range) => {
		return (
      <>
      <div css={{marginRight: '10px', fontFamily: 'GuardianTextSans', fontSize: '1.0625rem'}}>{k}</div>
			<FormItem
				text={formItems[k]}
				choices={choices}
				label={`${key}.${k}`}
				key={`${key}.${k}`}
				dispatcher={dispatcher}
			/>
      </>
		);
	});
	return [
		<div css={{display: 'flex !important'}}>
			{/* <Legend key={`${key}.legend`} text={key}></Legend> */}
			{fields}
		</div>,
	];
};
