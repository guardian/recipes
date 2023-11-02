/** @jsxImportSource @emotion/react */
import { Button } from '@guardian/source-react-components';
import { ActionType, schemaItem } from 'interfaces/main';
import { Dispatch } from 'react';
import { handleAddField, handleRemoveField } from './form-input-handlers';

export const getItemButtons = (
	key: string,
	formItemAddId: string,
	formItemRemoveLastId: string,
	formFieldsSchema: schemaItem,
	dispatcher: Dispatch<ActionType>,
): JSX.Element => {
	return (
		<div css={{ marginTop: '5px' }}>
			<FormButton
				text={`+ ${key.split('.').slice(-1)[0]}`}
				buttonId={`${key}.add`}
				onClick={() =>
					handleAddField(formItemAddId, formFieldsSchema, dispatcher)
				}
			/>
			<FormButton
				text={`- ${key.split('.').slice(-1)[0]}`}
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
