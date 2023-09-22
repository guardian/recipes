import { allRecipeFields, ingredientListFields } from "../interfaces/main";
import fromPairs from "lodash-es/fromPairs";

export function orderComponents<
  T extends allRecipeFields | ingredientListFields,
>(
  rc: T,
  sortOrder: string[],
): T extends allRecipeFields ? allRecipeFields : ingredientListFields {
  if (rc === null) {
    return null;
  }
  return fromPairs(
    sortOrder.reduce(
      (acc, key: keyof allRecipeFields | ingredientListFields) => {
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
