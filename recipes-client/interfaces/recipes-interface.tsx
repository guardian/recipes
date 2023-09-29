export interface IdealRecipeObject {
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
	celebrationsIds: string[]; // Celebration(s) associated with recipe (e.g. Christmas, Thanksgiving, etc.)
	utensilsAndApplianceIds: string[]; // List of equipment needed for recipe (e.g. hob, frying pan, air fryer)
	techniquesUsedIds: string[]; // List of cooking techniques used (e.g. deep frying, baking)
	difficultyLevel: DifficultyLevel;
	serves?: Serves; // Number of servings
	timings: Timing[];
	instructions: Instruction[]; // Steps breaking down the recipe. For recipes that can't be stepified this would just be one big 'step' containing the method
}

export interface IngredientsGroup {
	recipeSection: string; // Title of group
	ingredientsList: Ingredient[]; // List of ingredients
}

interface Ingredient {
	name: string; // Name of ingredient
	ingredientID?: string; // Unique identifier of ingredient
	amount: Range; // Amount of ingredient. If it's a single amount then mix and max are the same
	unit: string; // Unit of measurement.
	prefix?: string; // Type of
	suffix?: string; // Any pre-cooking preparation needed (e.g. finely chopped, drained)
	optional: boolean; // Whether ingredient is optional
}

interface Instruction {
	stepNumber: number; // Order of the step
	description: string; // Detailed description of step
	images?: string[]; // Actually capiImage[]
}

export interface Serves {
	amount: Range; // Number of servings
	unit: string; // Unit of measurement, 'people' of 'units'
}

export interface Range {
	min: number; // Minimum value
	max: number; // Maximum value
}

export type BylineEntry =
	| { type: 'tag'; tagId: string }
	| { type: 'text'; text: string };

export interface ContributorTag {
	// Based on CAPI types, TBC
}

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export type Timing = {
	qualifier: string; // e.g. 'passive', 'active', 'set', 'chill'
	durationInMins: number;
};
