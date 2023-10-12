import { Legend } from '@guardian/source-react-components';

export const renderRangeInput = (
	// formItems: Range,
	key: string,
	// dispatcher: Dispatch<ActionType>,
): JSX.Element[] => {
	return [
		<fieldset key={`${key}.fieldset`}>
			<Legend key={`${key}.legend`} text={key}></Legend>
			<>
				<label htmlFor="min">Min</label>
				<input type="number" id="min" min="1" />
				<label htmlFor="max">Max</label>
				<input type="number" id="max" />
				<label htmlFor="unit">Unit</label>
				<select id="unit">
					<option value="people">People</option>
					<option value="units">Units</option>
				</select>
			</>
		</fieldset>,
	];
};
