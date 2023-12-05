export const ingredientSchema = {
	name: {
		type: 'string',
	},
	amount: {
		min: {
			type: 'integer',
		},
		max: {
			type: 'integer',
		},
	},
	unit: {
		type: 'string',
	},
	ingredientId: {
		type: 'string',
	},
	prefix: {
		type: 'string',
	},
	suffix: {
		type: 'string',
	},
	optional: {
		type: 'boolean',
	},
	text: {
		type: 'string',
	},
};

export const ingredientGroupSchema = {
	recipeSection: {
		type: 'string',
	},
	ingredientsList: {
		type: 'array',
		items: ingredientSchema,
		required: ['name'],
	},
};

export const methodStepSchema = {
	stepNumber: {
		type: 'integer',
	},
	description: {
		type: 'string',
	},
	images: {
		type: ['array', 'null'],
		items: {
			type: ['string', 'null'],
		},
	},
};
