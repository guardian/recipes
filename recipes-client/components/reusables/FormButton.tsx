import { Button } from '@guardian/source-react-components';

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

export default FormButton;
