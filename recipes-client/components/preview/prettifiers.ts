import { Ingredient, Range } from '../../interfaces/main';

export const prettifyNumber = (num: number): string => {
	if (!num) return '';
	else if (num % 1 === 0) {
		return num.toString();
	} else {
		switch (num) {
			case 0.13:
				return '⅛';
			case 0.25:
				return '¼';
			case 0.33:
				return '⅓';
			case 0.5:
				return '½';
			case 0.66:
				return '⅔';
			case 0.75:
				return '¾';
			case 1.5:
				return '1½';
			case 2.5:
				return '2½';
			case 3.5:
				return '3½';
			case 4.5:
				return '4½';
			default:
				return num.toString();
		}
	}
};

export const prettifyRange = (amount: Range) => {
	if (!amount) return '';
	return amount.min === amount.max
		? prettifyNumber(amount.min)
		: `${prettifyNumber(amount.min)}-${prettifyNumber(amount.max)}`;
};

export const prettifyDurationInMins = (durationInMins: number): string => {
	const hours = Math.floor(durationInMins / 60);
	const mins = durationInMins % 60;
	return `${hours > 0 ? `${hours}h` : ''} ${mins > 0 ? `${mins}m` : ''}`;
};

export const renderIngredientAsSentence = ({
	name,
	amount,
	unit,
	prefix,
	suffix,
}: Ingredient) => {
	const concernsTins = unit?.includes('tin');
	const isUnitRequiringSpace =
		unit?.includes('tbsp') || unit?.includes('tsp') || unit?.includes('clove');
	return `${amount ? prettifyRange(amount) : ''}${
		isUnitRequiringSpace ? ' ' : ''
	}${concernsTins ? ' x ' : ''}${unit ? unit : ''} ${
		prefix ? prefix : ''
	} ${name} ${suffix ? suffix : ''}`;
};
