/** @jsxImportSource @emotion/react */

import { UIschemaItem } from './ui';

export interface SchemaItem {
	type: string | string[];
	items?: SchemaItem;
	properties?: AllRecipeFields | ComplexRecipeFields;
	enum?: Array<string>;
}

export type ComplexRecipeFields =
	| IngredientsGroup
	| Timing
	| Timing[]
	| IngredientsGroup[]
	| Ingredient
	| Instruction
	| Instruction[]
	| Serves
	| Serves[]
	| Range;

export interface SchemaArrayItem {
	type: string | string[];
	items: Array<Record<string, unknown>>;
}

export const isSchemaArray = (obj: SchemaItem): obj is SchemaArrayItem => {
	return Object.keys(obj).includes('items');
};

export interface SchemaType {
	properties: {
		[key in keyof AllRecipeFields]: AllRecipeFields[key];
	};
}

export const isSchemaType = (
	obj: SchemaType | AllRecipeFields | IngredientsGroup | Timing,
): obj is SchemaType => {
	if (typeof obj !== 'object' || obj === null) return false;
	const wObj: { [k: string]: unknown } = obj;
	// const wObj: {[obj['properties']]?: unknown} = obj;
	return isAllRecipeFields(wObj.properties); // Improve this, ends up being called twice sometimes from isingredientListFields
};

export interface AllRecipeFields extends RecipeFields {}

export const isAllRecipeFields = (
	obj: undefined | null | AllRecipeFields | UIschemaItem,
): obj is AllRecipeFields => {
	if (obj === undefined || obj === null) return false;
	const keys = Object.keys(obj);
	return keys.includes('canonicalArticle') && keys.includes('byline');
};

export interface RecipeFields {
	isAppReady: boolean;
	composerId: string; // Unique identifier of canonical article in Composer
	id: string; // Unique identifier
	canonicalArticle: string; // ID of recipe in Content API
	webPublicationDate: string; // Date recipe was published
	title: string; // Name of the recipe
	description: string; // Short description of the recipe
	bookCredit?: string; // Credit for the book the recipe is from
	featuredImage: ImageObject; // !! Actually capiImage
	contributors: ContributorTag[]; // Structured data for contributors, where available
	byline: BylineEntry[]; // Authorship data for the piece, including references to contributors where available, and text where not. Accommodates cases like this
	ingredients: IngredientsGroup[]; // List of ingredients
	suitableForDietIds: string[]; // List of diets recipe is suitable for (e.g. vegetarian, vegan, kosher, halal, etc.)
	cuisineIds: string[]; // Cuisine type(s) of recipe (e.g. Italian, Mexican, etc.)
	mealTypeIds: string[]; // Categories of recipe (e.g. breakfast, lunch, dinner, dessert)
	celebrationIds: string[]; // Celebration(s) associated with recipe (e.g. Christmas, Thanksgiving, etc.)
	utensilsAndApplianceIds: string[]; // List of equipment needed for recipe (e.g. hob, frying pan, air fryer)
	techniquesUsedIds: string[]; // List of cooking techniques used (e.g. deep frying, baking)
	difficultyLevel: DifficultyLevel;
	serves?: Serves[]; // Number of servings
	timings: Timing[];
	instructions: Instruction[]; // Steps breaking down the recipe. For recipes that can't be stepified this would just be one big 'step' containing the method
}

export type ImageObject = {
	url: string;
	mediaId: string;
	cropId: string;
	source?: string;
	photographer?: string;
	imageType?: string;
	caption?: string;
	mediaApiUri?: string;
};

export type DifficultyLevel = 'easy' | 'medium' | 'hard';
export interface Instruction {
	stepNumber: number; // Order of the step
	description: string; // Detailed description of step
	images?: string[]; // Actually capiImage[]
}

export type RecipeItem =
	| null
	| string
	| string[]
	| IngredientsGroup[]
	| Timing[]
	| Ingredient[]
	| Instruction[]
	| Serves[];

export interface Range {
	min: number; // Minimum value
	max: number; // Maximum value
}

export type IngredientsGroup = {
	recipeSection?: string;
	ingredientsList: Ingredient[];
};

export interface Ingredient {
	name: string; // Name of ingredient
	ingredientID?: string; // Unique identifier of ingredient
	amount: Range; // Amount of ingredient. If it's a single amount then mix and max are the same
	unit: string; // Unit of measurement.
	prefix?: string; // Type of
	suffix?: string; // Any pre-cooking preparation needed (e.g. finely chopped, drained)
	optional: boolean; // Whether ingredient is optional
	text?: string; // Original text
}

export type Timing = {
	qualifier: string; // e.g. 'passive', 'active', 'set', 'chill'
	durationInMins: Range;
	text?: string; // Original text
};

export interface Serves {
	amount: Range; // Number of servings
	unit: string; // Unit of measurement, 'people' of 'units'
	text?: string; // Original text
}

export type BylineEntry =
	| { type: 'tag'; tagId: string }
	| { type: 'text'; text: string };

export interface ContributorTag {
	tag: 'string';
}

export interface ActionType {
	payload: AppDataState | AddRemoveItemType | ErrorItemType;
	type: string;
}

export type ErrorItemType = string;

export const isLoadingState = (
	payload: keyof typeof ActionType.payload,
): payload is LoadingState => {
	const ls = payload as LoadingState;
	if (ls.isLoading !== undefined) {
		return true;
	}
	return false;
};

export const isAddRemoveItemType = (
	payload: keyof typeof ActionType.payload,
): payload is AddRemoveItemType => {
	const p = payload as AddRemoveItemType;
	if (p.objId !== undefined) {
		return true;
	}
	return false;
};

export interface AddRemoveItemType {
	objId: string;
}

export type AppDataState = CurationState & LoadingState;

export interface LoadingState {
	readonly isLoading: boolean;
}

export interface CurationState {
	readonly body: AllRecipeFields | null;
	readonly schema: Record<string, unknown> | null;
	readonly html: Record<string, unknown> | null;
}

export type HighlightType = string; //keyof recipeFields;

export type Highlight = {
	id: string;
	type: HighlightType;
	range: ResourceRange;
};

export type ResourceRange = {
	elementNumber: number;
	startCharacter: number;
	endCharacter: number;
};
