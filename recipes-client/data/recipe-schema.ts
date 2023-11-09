export default {
	type: 'object',
	required: [],
	properties: {
		path: {
			type: 'string',
		},
		title: {
			type: 'string',
		},
		description: {
			type: 'string',
		},
		serves: {
			type: 'string',
		},
		time: {
			type: 'array',
			items: {
				type: 'object',
				required: [],
				properties: {
					instruction: {
						type: 'string',
					},
					quantity: {
						type: 'string',
					},
					unit: {
						type: 'string',
					},
				},
			},
		},
		steps: {
			type: 'array',
			items: {
				type: 'string',
			},
		},
		byline: {
			type: 'string',
		},
		ingredients: {
			type: 'array',
			items: [
				{
					type: 'object',
					properties: {
						recipeSection: {
							type: 'string',
						},
						ingredientsList: {
							type: 'array',
							items: [
								{
									type: 'object',
									properties: {
										name: {
											type: 'string',
										},
										amount: {
											type: 'integer',
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
									},
									required: ['name', 'amount', 'unit'],
								},
							],
						},
					},
					required: ['recipeSection', 'ingredientsList'],
				},
			],
		},
		celebrationIds: {
			type: 'string',
		},
		cuisineIds: {
			type: 'array',
			items: {
				type: 'string',
				enum: [
					'italian',
					'mexican',
					'southern_us',
					'indian',
					'french',
					'chinese',
					'thai',
					'cajun_creole',
					'japanese',
					'british',
					'greek',
					'spanish',
					'middleeastern',
					'eastern-european',
					'north-african/moroccan',
					'vietnamese',
					'korean',
					'filipino',
					'irish',
					'jamaican',
					'brazilian',
					'pan-african',
					'scandinavian',
					'australian',
					'turkish',
				],
			},
		},
		mealTypeIds: {
			type: ['string', 'null'],
			enum: [
				'starter',
				'main-course',
				'dessert',
				'snacks',
				'breakfast',
				'baking',
				'barbecue',
				'side-dishes',
				'soup',
			],
		},
	},
};
