/** @jsxImportSource @emotion/react */
import {
  allRecipeFields,
  isAllRecipeFields,
  ingredientListFields,
  ingredientField,
} from "../interfaces/main";

export type UIschemaItem = {
  [key in keyof allRecipeFields]: UIItem;
} & {
  "ui:order"?: string[];
};

export interface UIItem {
  "ui:display": boolean;
  "ui:locked"?: boolean;
  "ui:removable"?: boolean;
  "ui:order"?: string[];
}

export type UIGeneralItem = UIItem & ingredientListFields & ingredientField;

export function isUIschemaItem(
  obj: UIschemaItem | allRecipeFields,
): obj is UIschemaItem {
  return isAllRecipeFields(obj);
}
