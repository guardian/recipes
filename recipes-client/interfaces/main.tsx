/** @jsxImportSource @emotion/react */

import { UIschemaItem } from './ui';

export interface schemaItem {
	type: string | string[];
	items?: schemaItem;
	properties?: allRecipeFields | IngredientsGroup;
	enum?: Array<string>;
}

export interface schemaArrayItem {
	type: string | string[];
	items: Array<Record<string, unknown>>;
}

export function isSchemaArray(obj: schemaItem): obj is schemaArrayItem {
	return Object.keys(obj).includes('items');
}

export interface schemaType {
	properties: {
		[key in keyof allRecipeFields]: allRecipeFields[key];
	};
}

export const isSchemaType = (
	obj: schemaType | allRecipeFields | IngredientsGroup,
): obj is schemaType => {
	if (typeof obj !== 'object' || obj === null) return false;
	const wObj: { [k: string]: unknown } = obj;
	// const wObj: {[obj['properties']]?: unknown} = obj;
	// console.log(Object.keys(wObj))
	return isAllRecipeFields(wObj.properties); // Improve this, ends up being called twice sometimes from isingredientListFields
};

export interface allRecipeFields extends lingeringFields, recipeFields {}

export const isAllRecipeFields = (
	obj: undefined | null | allRecipeFields | UIschemaItem,
): obj is allRecipeFields => {
	if (obj === undefined || obj === null) return false;
	const keys = Object.keys(obj);
	return keys.includes('path') && keys.includes('byline');
};

export interface lingeringFields {
	path: string;
	id: string;
}

export interface recipeFields {
	title: string | null;
	description: string | null;
	serves: {
		amount: {
			min: number | null;
			max: number | null;
		};
		unit: string | null;
	} | null;
	timings: Timing[] | null;
	steps: string[] | null;
	byline: string[] | null;
	contributors: string[];
	celebrationIds: string[] | null;
	cuisineIds: string[] | null;
	ingredients: IngredientsGroup[];
	featuredImage: string | null;
}

export type recipeItem =
	| null
	| string
	| string[]
	| IngredientsGroup[]
	| Timing[]
	| Ingredient[];

interface Range {
	min: number; // Minimum value
	max: number; // Maximum value
}

export type IngredientsGroup = {
	recipeSection: string | null;
	ingredients: Ingredient[];
};

export type Ingredient = {
	name: string;
	amount: Range;
	unit: string;
	ingredientId?: string;
	prefix?: string;
	suffix?: string;
	optional?: boolean;
};

export type Timing = {
	qualifier: string;
	durationInMins: number;
};

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
