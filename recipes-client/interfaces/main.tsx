/** @jsxImportSource @emotion/react */

import { UIschemaItem } from './ui';

export interface schemaItem {
	type: string | string[];
	items?: schemaItem;
	properties?: allRecipeFields | ComplexRecipeFields;
	enum?: Array<string>;
}

export type ComplexRecipeFields =
	| IngredientsGroup
	| Timing
	| IngredientsGroup[]
	| Ingredient
	| Instruction
	| Range;

export interface schemaArrayItem {
	type: string | string[];
	items: Array<Record<string, unknown>>;
}

export const isSchemaArray = (obj: schemaItem): obj is schemaArrayItem => {
	return Object.keys(obj).includes('items');
};

export interface schemaType {
	properties: {
		[key in keyof allRecipeFields]: allRecipeFields[key];
	};
}

export const isSchemaType = (
	obj: schemaType | allRecipeFields | IngredientsGroup | Timing,
): obj is schemaType => {
	if (typeof obj !== 'object' || obj === null) return false;
	const wObj: { [k: string]: unknown } = obj;
	// const wObj: {[obj['properties']]?: unknown} = obj;
	return isAllRecipeFields(wObj.properties); // Improve this, ends up being called twice sometimes from isingredientListFields
};

export interface allRecipeFields extends recipeFields {}

export const isAllRecipeFields = (
	obj: undefined | null | allRecipeFields | UIschemaItem,
): obj is allRecipeFields => {
	if (obj === undefined || obj === null) return false;
	const keys = Object.keys(obj);
	return keys.includes('canonicalArticle') && keys.includes('byline');
};

export interface recipeFields {
	isAppReady: boolean;
	id: string; // Unique identifier
	canonicalArticle: string; // ID of recipe in Content API
	title: string; // Name of the recipe
	description: string; // Short description of the recipe
	featuredImage: string; // !! Actually capiImage
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

export type DifficultyLevel = 'easy' | 'medium' | 'hard';
export interface Instruction {
	stepNumber: number; // Order of the step
	description: string; // Detailed description of step
	images?: string[]; // Actually capiImage[]
}

export type recipeItem =
	| null
	| string
	| string[]
	| IngredientsGroup[]
	| Timing[]
	| Ingredient[];

export interface Range {
	min: number; // Minimum value
	max: number; // Maximum value
}

export type IngredientsGroup = {
	recipeSection: string;
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
	durationInMins: number;
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

export interface GuCAPIProps {
	articlePath: string;
	isLoading: boolean;
	html: Record<string, Record<string, unknown>>;
	recipeItems: recipeFields | null; //|Record<string, unknown>|null;
	schema: schemaType;
	colours?: string[] | null;
}

export function isCurationState(
	payload: keyof typeof ActionType.payload,
): payload is CurationState {
	const cs = payload as CurationState;
	if (cs.body || cs.schema || cs.html) {
		return true;
	}
	return false;
}

export function isLoadingState(
	payload: keyof typeof ActionType.payload,
): payload is LoadingState {
	const ls = payload as LoadingState;
	if (ls.isLoading !== undefined) {
		return true;
	}
	return false;
}

export function isAddRemoveItemType(
	payload: keyof typeof ActionType.payload,
): payload is AddRemoveItemType {
	const p = payload as AddRemoveItemType;
	if (p.objId !== undefined) {
		return true;
	}
	return false;
}

export interface AddRemoveItemType {
	objId: string;
}

export type AppDataState = CurationState & LoadingState;

export interface LoadingState {
	readonly isLoading: boolean;
}

export interface CurationState {
	readonly body: allRecipeFields | Record<string, unknown> | null;
	readonly schema: Record<string, unknown> | null;
	readonly html: Record<string, unknown> | null;
	readonly colours?: string[] | null;
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
