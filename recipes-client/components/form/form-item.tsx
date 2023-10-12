/** @jsxImportSource @emotion/react */
import { actions } from '../../actions/recipeActions';
import { Dispatch } from '@reduxjs/toolkit';
import { ActionType } from '../../interfaces/main';
import { formatTitle } from './form-group';
import FormButton from './form-button';
import { Option, Select, TextInput } from '@guardian/source-react-components';
import { keyframes } from '@emotion/react';

const handleChange = (
	event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	dispatcher: Dispatch<ActionType>,
): void => {
	const objId = event.target.id;
	const objVal = event.target.value;
	dispatcher({
		type: actions.change,
		payload: { [objId]: objVal },
	});
};

const handleRemoveField = (
	id: string,
	dispatcher: Dispatch<ActionType>,
): void => {
	dispatcher({
		type: actions.delete,
		payload: { objId: id },
	});
};

const renderInput = (
	value: string,
	key: string,
	choices: Array<string> | null,
	dispatcher?: Dispatch<ActionType> | null,
	removable?: boolean,
) => {
	const removeId = `${key}`;
	const rmAllowed = removable !== undefined ? removable : false;

	// console.debug(`${value} ${key}`);

	// console.log(`key: ${key}`);

	if (key === 'instructions') {
		return (
			<>
				<TextInput
					css={{ minWidth: '500px' }}
					key={key}
					id={key}
					label={key}
					onChange={(event) => handleChange(event, dispatcher)}
				/>
			</>
		);
	}

	if (choices === null || choices === undefined) {
		return (
			<div css={{ display: 'grid' }}>
				<TextInput
					css={{ minWidth: '500px' }}
					key={key}
					id={key}
					type={typeof value === 'number' ? 'number' : 'text'}
					label={key}
					value={value}
					onChange={(event) => handleChange(event, dispatcher)}
				/>
				{rmAllowed && (
					<FormButton
						text="-"
						buttonId={removeId}
						onClick={() => handleRemoveField(removeId, dispatcher)}
					/>
				)}
			</div>
		);
	} else {
		const choices_ = choices.slice();
		choices_.unshift('None');
		return (
			<>
				<Select
					label="Select an option"
					css={{ minWidth: '500px', display: 'grid' }}
					value={value}
					key={key}
					id={key}
					onChange={(event) => handleChange(event, dispatcher)}
				>
					{choices_.map((item) => {
						return (
							<Option key={`${key}.${String(item)}`} value={item}>
								{item}
							</Option>
						);
					})}
				</Select>
				{rmAllowed && (
					<FormButton
						text="-"
						buttonId={removeId}
						onClick={() => handleRemoveField(removeId, dispatcher)}
					/>
				)}
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

const FormItem = (prop: FormItemProps): JSX.Element => {
	const { label } = prop;
	const text = prop.text === null ? 'None' : prop.text;
	const choices = prop.choices || null;
	const dispatch = prop.dispatcher || null;

	return renderInput(text, label, choices, dispatch, prop.removable);
};
export default FormItem;
