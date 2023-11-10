import {
	allRecipeFields,
	Ingredient,
	IngredientsGroup,
	Instruction,
	isAllRecipeFields,
	isSchemaType,
	schemaItem,
	schemaType,
	Serves,
	Timing,
} from 'interfaces/main';

export const isTimingsField = (
	obj: Timing | Record<string, unknown>,
): obj is Timing => {
	if (typeof obj !== 'object' || obj === null) return false;
	return Object.keys(obj).includes('durationInMins');
};

export const isIngredientsField = (
	obj: IngredientsGroup | Record<string, unknown>,
): obj is Ingredient => {
	if (typeof obj !== 'object' || obj === null) return false;
	return Object.keys(obj).includes('ingredientsList');
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

export const isInstructionsField = (
	obj: schemaType | allRecipeFields | IngredientsGroup | undefined,
): obj is Instruction[] => {
	if (obj === undefined || obj === null) return false;
	if (isSchemaType(obj) || isAllRecipeFields(obj)) return false;
	return Object.keys(obj).includes('stepNumber');
};

export const isServesField = (obj: Serves): obj is Serves => {
	if (typeof obj !== 'object' || obj === null) return false;
	return (
		Object.keys(obj).includes('amount') && Object.keys(obj).includes('unit')
	);
};

export const isRangeField = (
	obj: schemaItem | Record<string, unknown>,
): obj is Range => {
	if (typeof obj !== 'object' || obj === null) return false;
	return Object.keys(obj).includes('min');
};
