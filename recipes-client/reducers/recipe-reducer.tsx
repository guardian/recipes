/** @jsxImportSource @emotion/react */
import { actions } from '../actions/recipeActions';
import { produce } from 'immer';
import {
	ActionType,
	AppDataState,
	schemaItem,
	isCurationState,
	isLoadingState,
	AddRemoveItemType,
	ErrorItemType,
	isAddRemoveItemType,
	isSchemaArray,
} from '../interfaces/main';
import { defaultHighlightColours } from '../consts';
import { getSchemaType } from '../utils/schema';

export const defaultState: AppDataState = {
	isLoading: true,
	body: null,
	schema: null,
	html: null,
	colours: null,
};

function updateStateItem(
	obj: Record<string, unknown>,
	keyPath: Array<string>,
	value: string | number | boolean | AppDataState,
): void {
	const lastKeyIndex = keyPath.length - 1;
	for (let i = 0; i < lastKeyIndex; ++i) {
		const key = isFinite(keyPath[i]) ? parseInt(keyPath[i]) : keyPath[i];
		const nextKey = i < lastKeyIndex ? keyPath[i + 1] : NaN;
		if (!(key in obj) || obj[key] === null) {
			// Check whether array is needed (key is number) rather than dict
			obj[key] = isFinite(nextKey) ? [] : {};
		}
		obj = obj[key];
	}
	obj[keyPath[lastKeyIndex]] = value;
}

function addStateItem(
	obj: Record<string, unknown>,
	keyPath: Array<string>,
	value: string | number | AppDataState,
): void {
	const lastKeyIndex = keyPath.length - 1;
	// Get nested object
	for (let i = 0; i < lastKeyIndex; ++i) {
		const key = isFinite(keyPath[i]) ? parseInt(keyPath[i]) : keyPath[i];
		const nextKey = i < lastKeyIndex ? keyPath[i + 1] : NaN;
		if (!(key in obj) || obj[key] === null) {
			// Check whether array is needed (key is number) rather than dict
			obj[key] = isFinite(nextKey) ? [] : {};
		}
		obj = obj[key];
	}

	// Add/Set value
	if (obj[keyPath[lastKeyIndex]] !== undefined && Array.isArray(obj)) {
		// a value at `lastKeyIndex` exists need to insert at desired position
		obj.splice(keyPath[lastKeyIndex], 0, value);
	} else {
		// New item, set value
		obj[keyPath[lastKeyIndex]] = value;
	}
}

function deleteStateItem(
	keyPath: Array<string | number>,
	obj: Record<string, unknown>,
): void {
	const lastKeyIndex = keyPath.length - 1;
	for (let i = 0; i < lastKeyIndex; ++i) {
		const key = isFinite(keyPath[i]) ? parseInt(keyPath[i]) : keyPath[i];
		const nextKey = i < lastKeyIndex ? Math.max(0, keyPath[i + 1]) : NaN;
		if (!(key in obj) || obj[key] === null) {
			obj[key] = isFinite(nextKey) ? [] : {};
		}
		obj = obj[key];
	}
	keyPath = keyPath.map((item) => {
		const s = isFinite(item) ? parseInt(item) : item;
		return s;
	});

	if (Array.isArray(obj)) {
		obj.splice(keyPath[lastKeyIndex], 1);
	} else {
		delete obj[keyPath[lastKeyIndex]];
	}
}

function initStateItem(
	draft: Record<string, unknown>,
	k: string,
	value: string | number,
): void {
	draft[k] = value;
}

function getSchemaItem(
	schemaI: schemaItem,
):
	| string
	| number
	| boolean
	| Record<string, unknown>
	| Array<Record<string, unknown>> {
	// Function returning "default" values for new item of type schemaItem.
	if (getSchemaType(schemaI.type).includes('string')) {
		return '';
	} else if (getSchemaType(schemaI.type).includes('integer')) {
		return 1;
	} else if (getSchemaType(schemaI.type).includes('boolean')) {
		return false;
	} else if (
		getSchemaType(schemaI.type).includes('array') &&
		isSchemaArray(schemaI)
	) {
		if (schemaI.items.type === 'string') {
			// Simple list like steps
			return schemaI.items.map((item: schemaItem) => {
				return getSchemaItem(item);
			});
		} else {
			// More complex object like ingredient lists
			const items = schemaI.items;
			return [getSchemaItem(items)];
			// })
		}
	} else if (
		getSchemaType(schemaI.type).includes('object') ||
		typeof schemaI === 'object'
	) {
		const schemaPropKeys = Object.keys(schemaI);
		const outputArray = schemaPropKeys.map<
			Array<string | Record<string, unknown>>
		>((key) => {
			return [key, getSchemaItem(schemaI[key])];
		}, []);
		return Entries2Object(outputArray);
	} else {
		new ErrorEvent('Invalid schemaItem provided.');
	}
}

function Entries2Object(
	arr: (string | Record<string, unknown>)[][],
): Record<string, unknown> {
	// Helper function to replace `Object.fromEntries(arr)`
	return [...arr].reduce((obj: Record<string, unknown>, [key, val]) => {
		if (typeof key === 'string') {
			obj[key] = val;
			return obj;
		}
	}, {});
}

export const recipeReducer = produce(
	(
		draft: AppDataState | AddRemoveItemType | ErrorItemType,
		action: ActionType,
	) => {
		switch (action.type) {
			case actions.change: {
				const key = Object.keys(action.payload)[0];
				const keyPathArr = key.split('.');
				updateStateItem(draft.body, keyPathArr, action.payload[key]);
				break;
			}
			case actions.init: {
				if (isLoadingState(action.payload)) {
					draft['isLoading'] = action.payload.isLoading;
				} else {
					Object.keys(action.payload).forEach((k) => {
						initStateItem(draft, k, action.payload[k]);
					});
				}
				break;
			}
			case actions.reset: {
				initStateItem(draft, 'body', action.payload.body);
				break;
			}
			case actions.delete: {
				if (isAddRemoveItemType(action.payload)) {
					const keyPathArr = action.payload['objId'].split('.');
					deleteStateItem(keyPathArr, draft.body);
				}
				break;
			}
			case actions.add: {
				if (isAddRemoveItemType(action.payload)) {
					const keyPathArr = action.payload['objId'].split('.');
					const value = getSchemaItem(action.schemaItem);
					addStateItem(draft.body, keyPathArr, value);
				}
				break;
			}
			case actions.changeColours: {
				if (isCurationState(action.payload)) {
					const colours =
						action.payload.colours !== null
							? action.payload.colours
							: defaultHighlightColours;
					// let colourMap = null;
					// if (colours === null) {
					//   colourMap = Object.keys(recipeItems).reduce((acc, key, i) => {
					//     acc[key] = cols[i % cols.length];
					//     return acc
					//   }, {})
					// } else {

					// }
					initStateItem(draft, 'colours', colours);
				}
				break;
			}
			case actions.selectImg: {
				updateStateItem(draft.body, ['featuredImage'], action.payload);
				break;
			}
			case actions.error: {
				alert(action.payload);
				break;
			}
			default: {
				throw new Error(action.payload as string);
			}
		}
	},
	{},
);
function isSchemaObject(schemaI: schemaItem): boolean {
	return schemaI.type === 'object' && schemaI.properties !== undefined;
}
