import { SchemaItem } from '../interfaces/main';
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

export const excludeInForm = ['byline', 'featuredImage'];
export const excludeInHighlights = excludeInForm.concat([
	'cuisineIds',
	'mealTypeIds',
	'celebrationIds',
]);
export const bylineFields = ['byline'];

export const UIschema: UIschemaItem = {
	'ui:order': [
		'isAppReady',
		'id',
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
	isAppReady: {
		'ui:display': true,
		'ui:locked': false,
		'ui:removable': false,
	},
	id: {
		'ui:display': false,
		'ui:locked': true,
		'ui:removable': false,
	},
	canonicalArticle: {
		'ui:display': false,
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
	bookCredit: {
		'ui:display': true,
		'ui:locked': false,
		'ui:removable': false,
	},
	serves: {
		'ui:display': true,
		'ui:locked': false,
		'ui:removable': true,
		'ui:order': ['amount', 'unit'],
		amount: {
			'ui:display': true,
			'ui:locked': false,
			'ui:removable': false,
			'ui:order': ['min', 'max'],
		},
		unit: {
			'ui:display': true,
			'ui:locked': false,
			'ui:removable': false,
		},
		text: {
			'ui:display': true,
			'ui:locked': false,
			'ui:removable': false,
		},
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
		'ui:order': ['qualifier', 'durationInMins'],
		qualifier: {
			'ui:display': true,
			'ui:locked': false,
			'ui:removable': true,
		},
		durationInMins: {
			'ui:display': true,
			'ui:locked': false,
			'ui:removable': true,
			'ui:order': ['min', 'max'],
		},
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
		'ui:removable': true,
	},
	ingredients: {
		'ui:display': true,
		'ui:locked': false,
		'ui:removable': false,
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
		'ui:display': false,
		'ui:locked': false,
		'ui:removable': true,
	},
	techniquesUsedIds: {
		'ui:display': false,
		'ui:locked': false,
		'ui:removable': true,
	},
	difficultyLevel: {
		'ui:display': false,
		'ui:locked': false,
		'ui:removable': true,
	},
};

export const isDisplayed = (key: keyof SchemaItem | string): boolean => {
	// const wObj: {[k: string]: unknown} = obj;
	const wUIschema: { [key: string]: { 'ui:display': false } } = UIschema; // safely widen to wObj
	return wUIschema[key]['ui:display'];
};
export const isRemovable = (key: keyof SchemaItem | string): boolean => {
	const wUIschema: { [key: string]: { 'ui:removable': false } } = UIschema; // safely widen to wObj
	return wUIschema[key]['ui:removable'];
};

// const filtered = Object.keys(raw)
//   .filter(key => allowed.includes(key))
//   .reduce((obj, key) => {
//     obj[key] = raw[key];
//     return obj;
//   }, {});
