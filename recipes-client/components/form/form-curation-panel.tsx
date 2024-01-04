/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { ActionType, AllRecipeFields } from 'interfaces/main';
import { Dispatch } from 'react';
import { Legend, Select, Option } from '@guardian/source-react-components';

interface CurationPanelProps {
	isLoading: boolean;
	body: AllRecipeFields;
	dispatcher: Dispatch<ActionType>;
}
export const CurationPanel = ({
	isLoading,
	body,
	dispatcher,
}: CurationPanelProps) => {
	const curators = [
		'Anna Berrill',
		'Tim Lusher',
		'Gareth Grundy',
		'Dave Hall',
		'Mina Holland',
	].sort((a, b) => a.localeCompare(b));
	const renderCuratorOptions = (curators: string[]) => {
		return curators.map((curator) => (
			<Option key={curator} value={curator}>
				{curator}
			</Option>
		));
	};
	return (
		<div
			css={css`
				background-color: lightgray;
				border-radius: 5px;
			`}
		>
			<div
				css={css`
					padding: 10px;
					margin-bottom: 1rem;
				`}
			>
				<Legend
					key={`curationAssignee`}
					text={'Curation assignee'}
					css={{ width: '150px' }}
				/>
				<Select
					value={body.curationAssignee}
					onChange={(e) => {
						dispatcher({
							type: 'change',
							payload: { curationAssignee: e.target.value },
						});
					}}
					label={''}
				>
					<Option value="">-</Option>
					{renderCuratorOptions(curators)}
				</Select>
			</div>
		</div>
	);
};
