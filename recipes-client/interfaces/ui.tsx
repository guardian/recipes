/** @jsxImportSource @emotion/react */
import {
	allRecipeFields,
	isAllRecipeFields,
	IngredientsGroup,
	Ingredient,
} from '../interfaces/main';

export type UIschemaItem = {
	[key in keyof allRecipeFields]: UIItem;
} & {
	'ui:order'?: string[];
};

export interface UIItem {
	'ui:display': boolean;
	'ui:locked'?: boolean;
	'ui:removable'?: boolean;
	'ui:order'?: string[];
}

export type UIGeneralItem = UIItem & IngredientsGroup & Ingredient;

export const isUIschemaItem = (
	obj: UIschemaItem | allRecipeFields,
): obj is UIschemaItem => {
	return isAllRecipeFields(obj);
};
