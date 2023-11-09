export default {
	path: '/food/2019/mar/02/yotam-ottolenghi-north-african-recipes-tunisian-pepper-salad-moroccan-chicken-pastilla-umm-ali-pudding',
	title: 'Grilled pepper salad with fresh cucumber and herbs.',
	description:
		'A simple, fresh and delicious salad that can be served as a starter or a side dish.',
	serves: 'Serves 4.',
	time: [
		{
			instruction: 'Prep',
			quantity: '20',
			unit: 'min',
		},
		{
			instruction: 'Cook',
			quantity: '40',
			unit: 'min',
		},
	],
	steps: [
		'Heat the oven to 250 C (230 C fan)/480 F/gas 9.',
		'In a large bowl, toss together all the peppers, tomatoes, onions, chilli, garlic, four tablespoons of oil, three-quarters of a teaspoon of salt and a good grind of pepper.',
		'Spread out on two large oven trays lined with greaseproof paper and roast for about 35 minutes, stirring once or twice, or until softened and charred in places.',
		'Remove the trays from the oven and, once they\\u2019re cool enough to handle, coarsely chop the vegetables into a chunky mash and transfer to a bowl with the lemon juice, herbs, half a teaspoon of salt and a good grind of pepper.',
		'In a second bowl, toss the cucumber with the remaining two tablespoons of oil, a quarter-teaspoon of salt and a grind of pepper.',
		'To serve, spread the roast pepper mixture over a plate, pile the cucumber in the middle and sprinkle with the urfa chilli.',
	],
	byline: 'Yotam Ottolenghi',
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
	celebrationIds: 'summer-food-and-drink',
	cuisineIds: ['north-african/moroccan', 'middleeastern', 'indian'],
	mealTypeIds: 'main-course',
};
