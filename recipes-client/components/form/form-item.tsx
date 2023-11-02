/** @jsxImportSource @emotion/react */
import { actions } from '../../actions/recipeActions';
import { Dispatch } from '@reduxjs/toolkit';
import { ActionType } from '../../interfaces/main';
import FormButton from './form-button';
import {
	Checkbox,
	Option,
	Select,
	TextInput,
} from '@guardian/source-react-components';

const handleChangeText = (
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

const handleChangeNumber = (
	event: React.ChangeEvent<HTMLInputElement>,
	dispatcher: Dispatch<ActionType>,
): void => {
	const objId = event.target.id;
	const objVal = Number(event.target.value);
	dispatcher({
		type: actions.change,
		payload: { [objId]: objVal },
	});
};

const handleChangeBoolean = (
	event: React.ChangeEvent<HTMLInputElement>,
	dispatcher: Dispatch<ActionType>,
): void => {
	const objId = event.target.id;
	const objVal = event.target.checked;
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
			<div css={{ display: 'grid' }}>
				<TextInput
					css={{ minWidth: '500px' }}
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
	const { label, removable } = prop;
	const text = prop.text === null ? 'None' : prop.text;
	const choices = prop.choices || null;
	const dispatch = prop.dispatcher || null;

	return renderInput(text, label, choices, dispatch, removable);
};
export default FormItem;
