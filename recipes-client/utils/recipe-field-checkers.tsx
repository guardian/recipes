import {
	allRecipeFields,
	Ingredient,
	IngredientsGroup,
	isAllRecipeFields,
	isSchemaType,
	schemaItem,
	schemaType,
	Timing,
} from 'interfaces/main';

export const isTimingsField = (
	obj: Timing | Record<string, unknown>,
): obj is Timing => {
	if (typeof obj !== 'object' || obj === null) return false;
	return Object.keys(obj).includes('qualifier');
};

export const isIngredientField = (
	obj: schemaItem | Ingredient,
): obj is Ingredient => {
	if (typeof obj !== 'object' || obj === null) return false;
	return Object.keys(obj).includes('amount');
};

export const isIngredientsListField = (
	obj: schemaType | allRecipeFields | IngredientsGroup | undefined,
): obj is IngredientsGroup => {
	if (obj === undefined || obj === null) return false;
	if (isSchemaType(obj) || isAllRecipeFields(obj)) return false;
	return Object.keys(obj).includes('ingredientsList');
};
