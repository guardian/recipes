import { schemaItem } from '../interfaces/main';
import { UIschemaItem } from '../interfaces/ui';

/* Routing information */
export const apiURL = '/api/curation/';
export const capiProxy = '/api/capi/';
export const listEndpoint = '/api/list';
export const schemaEndpoint = 'schema';
export const saveEndpoint = 'submit';
export const curationEndpoint = 'curation';

export const urls = {
	capiQuery: 'capi',
	matches: 'check',
};

/* UI display output config */
export const newColours = [
	'aquamarine',
	'blue',
	'brown',
	'coral',
	'yellow',
	'chartreuse',
	'darkseagreen',
];
export const defaultHighlightColours = [
	'#E69F0090',
	'#56B4E990',
	'#009E7390',
	'#FEDC2A',
	'#0072B290',
	'#D55E0090',
	'#CC79A790',
];

export const excludeInForm = ['byline', 'recipeId', 'featuredImage', 'path'];
export const excludeInHighlights = excludeInForm.concat([
	'cuisineIds',
	'mealTypeIds',
	'celebrationIds',
]);
export const bylineFields = ['byline'];

export const UIschema: UIschemaItem = {
	'ui:order': [
		'id',
		'path',
		'recipeId',
		'canonicalArticle',
		'title',
		'description',
		'contributors',
		'byline',
		'featuredImage',
		'serves',
		'timings',
		'instructions',
		'ingredients',
		'suitableForDietIds',
		'cuisineIds',
		'mealTypeIds',
		'celebrationIds',
		'utensilsAndApplianceIds',
		'techniquesUsedIds',
		'difficultyLevel',
	],
	id: {
		'ui:display': true,
		'ui:locked': true,
		'ui:removable': false,
	},
	path: {
		'ui:display': true,
		'ui:locked': false,
		'ui:removable': false,
	},
	recipeId: {
		'ui:display': false,
		'ui:locked': true,
		'ui:removable': false,
	},
	canonicalArticle: {
		'ui:display': true,
		'ui:locked': true,
		'ui:removable': false,
	},
	title: {
		'ui:display': true,
		'ui:locked': false,
		'ui:removable': false,
	},
	description: {
		'ui:display': true,
		'ui:locked': false,
		'ui:removable': false,
	},
	serves: {
		'ui:display': true,
		'ui:locked': false,
		'ui:removable': false,
	},
	featuredImage: {
		'ui:display': false,
		'ui:locked': false,
		'ui:removable': false,
	},
	timings: {
		'ui:display': true,
		'ui:locked': false,
		'ui:removable': true,
	},
	instructions: {
		'ui:display': true,
		'ui:locked': false,
		'ui:removable': true,
	},
	contributors: {
		'ui:display': true,
		'ui:locked': false,
		'ui:removable': true,
	},
	byline: {
		'ui:display': true,
		'ui:locked': false,
		'ui:removable': false,
	},
	ingredients: {
		'ui:display': true,
		'ui:locked': false,
		'ui:removable': true,
		'ui:order': ['recipeSection', 'ingredientsList'],
		ingredientsList: {
			'ui:display': true,
			'ui:order': [
				'name',
				'amount',
				'unit',
				'ingredientId',
				'prefix',
				'suffix',
				'optional',
			],
			amount: {
				'ui:display': true,
				'ui:order': ['min', 'max'],
			},
		},
		recipeSection: {
			'ui:display': true,
		},
	},
	celebrationIds: {
		'ui:display': true,
		'ui:locked': false,
		'ui:removable': true,
	},
	cuisineIds: {
		'ui:display': true,
		'ui:locked': false,
		'ui:removable': true,
	},
	mealTypeIds: {
		'ui:display': true,
		'ui:locked': false,
		'ui:removable': true,
	},
	suitableForDietIds: {
		'ui:display': true,
		'ui:locked': false,
		'ui:removable': true,
	},
	utensilsAndApplianceIds: {
		'ui:display': true,
		'ui:locked': false,
		'ui:removable': true,
	},
	techniquesUsedIds: {
		'ui:display': true,
		'ui:locked': false,
		'ui:removable': true,
	},
	difficultyLevel: {
		'ui:display': true,
		'ui:locked': false,
		'ui:removable': true,
	},
};

// function isRemovable(key:string){

// }
// function isLocked(key:string){

// }
export const isDisplayed = (key: keyof schemaItem | string): boolean => {
	// const wObj: {[k: string]: unknown} = obj;
	const wUIschema: { [key: string]: { 'ui:display': false } } = UIschema; // safely widen to wObj
	return wUIschema[key]['ui:display'];
};
export const isRemovable = (key: keyof schemaItem | string): boolean => {
	const wUIschema: { [key: string]: { 'ui:removable': false } } = UIschema; // safely widen to wObj
	return wUIschema[key]['ui:removable'];
};

// const filtered = Object.keys(raw)
//   .filter(key => allowed.includes(key))
//   .reduce((obj, key) => {
//     obj[key] = raw[key];
//     return obj;
//   }, {});
