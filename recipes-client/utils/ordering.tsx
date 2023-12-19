import { AllRecipeFields, ComplexRecipeFields } from '../interfaces/main';
import fromPairs from 'lodash-es/fromPairs';

export const orderComponents = <
	T extends AllRecipeFields | ComplexRecipeFields,
>(
	rc: T,
	sortOrder: string[],
): T extends AllRecipeFields ? AllRecipeFields : ComplexRecipeFields => {
	if (rc === null) {
		return null;
	}
	return fromPairs(
		sortOrder.reduce(
			(acc, key: keyof AllRecipeFields | ComplexRecipeFields) => {
				if (Object.keys(rc).includes(key)) {
					return [...acc, [key, rc[key]]];
				} else {
					return acc;
				}
			},
			[],
		),
	) as typeof rc;
};
