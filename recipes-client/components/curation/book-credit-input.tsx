/** @jsxImportSource @emotion/react */
import { Legend, TextInput } from '@guardian/source-react-components';
import { ActionType } from 'interfaces/main';
import { useState } from 'react';

interface BookCreditInputProps {
	isLoading: boolean;
	body: Record<string, unknown>;
	dispatcher: React.Dispatch<ActionType>;
}

export const BookCreditInput = ({
	isLoading,
	body,
	dispatcher,
}: BookCreditInputProps) => {
	if (isLoading) {
		return <h3> LOADING... </h3>;
	} else if (body.bookCredit === undefined || body.bookCredit === null) {
		return (
			<div
				css={{
					width: '120px',
					height: '27px',
					fontFamily: 'GuardianTextSans',
					alignSelf: 'end',
					border: '1px solid black',
					padding: '8px',
					margin: '4px',
					marginLeft: '2px',
					borderRadius: '4px',
					textAlign: 'center',
					cursor: 'pointer',
					backgroundColor: '#052962',
					color: 'white',
				}}
				onClick={() => {
					dispatcher({
						type: 'change',
						payload: { bookCredit: '' },
					});
				}}
			>
				Add book credit
			</div>
		);
	} else {
		// Book input that updates on value input
		const [bookCredit, setBookCredit] = useState(body.bookCredit as string);
		return (
			<div css={{ overflow: 'scroll' }}>
				<Legend
					key={`bookCredit.legend`}
					text={'Book credit'}
					css={{ width: '150px' }}
				/>
				<TextInput
					value={bookCredit}
					onChange={(e) => {
						setBookCredit(e.target.value);
						dispatcher({
							type: 'change',
							payload: { bookCredit: e.target.value },
						});
					}}
					label={''}
				/>
				<hr />
			</div>
		);
	}
};
