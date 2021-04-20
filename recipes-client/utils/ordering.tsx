import { allRecipeFields, recipeItem } from "~interfaces/main";
import fromPairs from "lodash-es/fromPairs";

export function orderComponents(rc: allRecipeFields, sortOrder: string[]) {
  if (rc === null) {return null;}
  return fromPairs(
    sortOrder.map((key: keyof allRecipeFields) => {
      const value = rc[key];
      return [key, value];
    })
  );
}
