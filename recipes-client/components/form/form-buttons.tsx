/** @jsxImportSource @emotion/react */
import { Button } from '@guardian/source-react-components';
import { ActionType, SchemaItem } from 'interfaces/main';
import { Dispatch } from 'react';
import { handleAddField, handleRemoveField } from './form-input-handlers';

export const getItemButtons = (
	key: string,
	formItemAddId: string,
	formItemRemoveLastId: string,
	formFieldsSchema: SchemaItem,
	dispatcher: Dispatch<ActionType>,
): JSX.Element => {
	if (key === 'timings') {
		formFieldsSchema = formFieldsSchema.properties;
	}
	if (key === 'instructions') {
		formFieldsSchema = formFieldsSchema.properties;
	}
	if (key === 'serves') {
		formFieldsSchema = formFieldsSchema.properties;
	}
	return (
		<div css={{ marginTop: '5px', display: 'flex', alignItems: 'center' }}>
			<FormButton
				text={`Add`}
				buttonId={`${key}.add`}
				onClick={() =>
					handleAddField(formItemAddId, formFieldsSchema, dispatcher)
				}
			/>
			<FormButton
				text={`Remove`}
				buttonId={`${key}.add`}
				onClick={() => handleRemoveField(formItemRemoveLastId, dispatcher)}
			/>
		</div>
	);
};

interface FormButtonProps {
	text: string;
	buttonId: string;
	onClick: () => void;
}

const FormButton = ({ text, buttonId, onClick }: FormButtonProps) => {
	return (
		<Button id={buttonId} priority="primary" size="xsmall" onClick={onClick}>
			{text}
		</Button>
	);
};
