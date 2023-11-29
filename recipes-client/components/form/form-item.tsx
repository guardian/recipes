/** @jsxImportSource @emotion/react */
import { Dispatch } from '@reduxjs/toolkit';
import { ActionType } from '../../interfaces/main';
import { Checkbox, Option, Select } from '@guardian/source-react-components';
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
	if (typeof value === 'boolean' || key.includes('optional')) {
		if (key.includes('ingredients')) {
			return (
				<Checkbox
					checked={value}
					id={key}
					key={key}
					onChange={(event) => handleChangeBoolean(event, dispatcher)}
				/>
			);
		} else {
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
	}

  if (value === null || value === undefined) {
    return (<input css={{
      height: '25px',
      padding: '8px',
      margin: '4px 4px 4px 0',
      fontFamily: 'GuardianTextSans',
      fontSize: '1.0625rem',
      width: `${
        typeof value === 'number'
          ? '50px' : key.includes("ingredient") ? key.includes("unit") ? "50px" : "200px" : "600px"
      }`,
    }}value="" />)
  }

	if (choices === null || choices === undefined) {
		if (key.includes('instructions') && key.includes('description')) {
			return (
				<div css={{ display: 'grid' }}>
					<textarea
						css={{
							padding: '4px',
							fontFamily: 'GuardianTextSans',
							fontSize: '1.0625rem',
							width: '500px',
							height: '60px',
							margin: '4px 4px 4px 0',
						}}
						key={key}
						id={key}
						// type={typeof value}
						// label={key}
						value={value}
						onChange={(event) => handleChangeText(event, dispatcher)}
					/>
				</div>
			);
		}

		return (
			<div css={{ display: 'grid' }}>
				<input
					css={{
						height: '25px',
						padding: '8px',
						margin: '4px 4px 4px 0',
						fontFamily: 'GuardianTextSans',
						fontSize: '1.0625rem',
						width: `${
							typeof value === 'number'
								? '50px' : key.includes("ingredient") ? key.includes("unit") ? "50px" : "200px" : "600px"
						}`,
					}}
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
				<select
					css={{
						width: '200px',
						display: 'grid',
						fontFamily: 'GuardianTextSans',
						fontSize: '1.0625rem',
						marginRight: '4px',
					}}
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
				</select>
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
	const itemText = text === null ? "" : text;

	return renderInput(itemText, label, choices, dispatcher, removable);
};
export default FormItem;
