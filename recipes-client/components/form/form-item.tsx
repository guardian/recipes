/** @jsxImportSource @emotion/react */
import { Dispatch } from '@reduxjs/toolkit';
import { ActionType } from '../../interfaces/main';
import {
	Checkbox,
	Option,
	Select,
} from '@guardian/source-react-components';
import {
	handleChangeBoolean,
	handleChangeNumber,
	handleChangeText,
} from './form-input-handlers';

const renderInput = (
	value: string,
	key: string,
	choices: Array<string> | null,
	dispatcher?: Dispatch<ActionType>,
	removable?: boolean,
) => {
	const removeId = key;
	const rmAllowed = removable !== undefined ? removable : false;

	if (typeof value === 'boolean') {
		return (
			<Checkbox
				label={key}
				checked={value}
				id={key}
				key={key}
				onChange={(event) => handleChangeBoolean(event, dispatcher)}
			/>
		);
	}

	if (choices === null || choices === undefined) {
		return (
			<div css={{ display: 'grid'}}>
				<input
					css={{ height: '25px', padding: '8px', fontFamily: 'GuardianTextSans', fontSize: '1.0625rem'}}
					key={key}
					id={key}
					type={typeof value}
					label={key}
					value={value}
					onChange={(event) => {
						typeof value === 'number'
							? handleChangeNumber(event, dispatcher)
							: handleChangeText(event, dispatcher);
					}}
				/>
			</div>
		);
	} else {
		const choices_ = choices.slice().sort((a, b) => a.localeCompare(b));
		// choices_.unshift('');
		return (
			<>
				<Select
					label="Select an option"
					css={{ minWidth: '500px', display: 'grid' }}
					value={value}
					key={key}
					id={key}
					onChange={(event) => handleChangeText(event, dispatcher)}
				>
					{choices_.map((item) => {
						return (
							<Option key={`${key}.${String(item)}`} value={item}>
								{item}
							</Option>
						);
					})}
				</Select>
			</>
		);
	}
};

interface FormItemProps {
	label: string;
	text: string | null;
	// type: string|null,
	choices: Array<string> | null;
	dispatcher?: Dispatch<ActionType> | null;
	removable?: boolean;
}

const FormItem = ({
	label,
	removable,
	text,
	choices,
	dispatcher,
}: FormItemProps): JSX.Element => {
	const itemText = text === null ? 'None' : text;

	return renderInput(itemText, label, choices, dispatcher, removable);
};
export default FormItem;
