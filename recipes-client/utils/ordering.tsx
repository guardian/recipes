import { allRecipeFields, ComplexRecipeFields } from '../interfaces/main';
import fromPairs from 'lodash-es/fromPairs';

export function orderComponents<
	T extends allRecipeFields | ComplexRecipeFields,
>(
	rc: T,
	sortOrder: string[],
): T extends allRecipeFields ? allRecipeFields : ComplexRecipeFields {
	if (rc === null) {
		return null;
	}
	return fromPairs(
		sortOrder.reduce(
			(acc, key: keyof allRecipeFields | ComplexRecipeFields) => {
				console.log('Key: ', key);
				console.log('RC: ', rc);
				if (Object.keys(rc).includes(key)) {
					return [...acc, [key, rc[key]]];
				} else {
					return acc;
				}
			},
			[],
		),
	) as typeof rc;
}
