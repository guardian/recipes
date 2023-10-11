import { allRecipeFields, IngredientsGroup } from '../interfaces/main';
import fromPairs from 'lodash-es/fromPairs';

export function orderComponents<T extends allRecipeFields | IngredientsGroup>(
	rc: T,
	sortOrder: string[],
): T extends allRecipeFields ? allRecipeFields : IngredientsGroup {
	if (rc === null) {
		return null;
	}
	return fromPairs(
		sortOrder.reduce((acc, key: keyof allRecipeFields | IngredientsGroup) => {
			if (Object.keys(rc).includes(key)) {
				return [...acc, [key, rc[key]]];
			} else {
				return acc;
			}
		}, []),
	) as typeof rc;
}
