import {
	Highlight,
	Ingredient,
	recipeFields,
	recipeItem,
	ResourceRange,
	Timing,
	IngredientsGroup,
} from '../interfaces/main';
import { HTMLElement, parse } from 'node-html-parser';
import flatten from 'lodash-es/flatten';

export function DOMParse(html: string): HTMLElement {
	const dom = parse(html);
	return dom;
}

export function getHighlights(
	doc: HTMLElement,
	recipeItems: recipeFields,
): Highlight[][] {
	/* Create array of Highlight objects from 'doc' given 'recipeItems' and optional list of keys.*/
	const allHighlights = Object.entries(recipeItems).map((k) => {
		const textItems: string[] = flatten(
			getTextfromRecipeItem(k[1] as recipeItem),
		); // bit of a hack, better approach?
		const highlights = textItems.map((text, iHlight) => {
			const offsets = findTextinHTML(text, doc);
			const highlightType = getHighlightType(k[0], k[1] as recipeItem, text); //k[0];
			return offsets.map((offset) => {
				const id = `${highlightType}_${iHlight}`;
				return {
					id: id,
					type: highlightType,
					range: { ...offset },
				} as Highlight;
			});
		});
		return flatten(highlights);
	});
	return allHighlights;
}

function getHighlightType(
	fieldName: string,
	recipeItem: recipeItem,
	text: string,
): string {
	// Determine the type of the highlight provided
	if (recipeItem === null || typeof recipeItem === 'string') {
		return fieldName;
	}
	if (!isIngredientFieldsArray(recipeItem)) {
		return fieldName;
	} else {
		// Check if highlight is title else return ingredient
		const label = recipeItem.reduce((acc, rItem) => {
			if (isIngredientList(rItem)) {
				if (rItem.title === text && rItem.title !== '') {
					return [...acc, `ingredient_list_title`];
				}
			} else {
				return acc;
			}
			return acc;
		}, [] as string[]);

		return label.length === 0 ? `ingredient` : label[0];
	}
}

export function getUniqueHighlightTypes(highlights: Highlight[][]): string[] {
	const keys = flatten(highlights).map((high) => {
		return high.type;
	});
	const uniqueKeys = new Set(keys);
	return Array.from(uniqueKeys);
}

function isIngredientList(
	arg: null | string | IngredientsGroup,
): arg is IngredientsGroup {
	if (arg === null || typeof arg === 'string') {
		return false;
	} else {
		return 'ingredients' in arg;
	}
}

function isIngredientFieldsArray(
	arg: Array<string | IngredientsGroup | Ingredient | Timing>,
): arg is IngredientsGroup[] {
	if (typeof arg[0] === 'string' || arg.length === 0 || arg[0] === null) {
		return false;
	} else {
		return 'ingredients' in arg[0];
	}
}

function isStringArray(arg: Array<unknown>): arg is string[] {
	return typeof arg[0] === 'string';
}

// export function getTextfromRecipeItem(item: string | ingredientField | ingredientField[] | timeField | null): string[] {

export function getTextfromRecipeItem(item: recipeItem | string): string[] {
	/* Extract text from recipe item
	 Select relevant field (item if array of strings, 'text' if object)
  */
	if (typeof item === 'string') {
		// Plain string, wrap up as array
		return [item];
	} else if (item === null) {
		return [''];
	} else if (item instanceof Array) {
		if (isStringArray(item)) {
			// String array, return as is
			return item;
		} else if (isIngredientFieldsArray(item)) {
			// Parse each array of each 'ingredient' key
			return flatten(
				item.map((i) => {
					return getTextfromRecipeItem([
						...getTextfromRecipeItem(i['title']),
						...getTextfromRecipeItem(i['ingredientsList']),
					]);
				}),
			);
		} else {
			// Parse each entry in time/ingredient array
			return flatten(
				(item as Array<Timing | Ingredient>).map((i) => {
					return getTextfromRecipeItem(i['text']);
				}),
			);
		}
	} else {
		// Object: timeField|ingredientField
		return [item['text']];
	}
}

export function findTextinHTML(
	text: string,
	html: HTMLElement,
): ResourceRange[] {
	function escapeRegExp(str: string) {
		/* Escape special characters helper */
		return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
	}

	const results: ResourceRange[] = [];
	if (text === '') {
		return results;
	} // Safe-guard for empty strings
	const words: string[] = escapeRegExp(
		// Split into words
		text.trim(),
	)
		.split(/[\\.,:;-]{0,1}\s/)
		.map((w) => {
			// Convert any unicode characters
			return w.replace(/\\u([a-f0-9]{4})/gi, function (n, hex) {
				return String.fromCharCode(parseInt(hex, 16));
			});
		});

	// Assemble regex to match text elements in HTML
	const startingMarkupAndBreak = '(?!<br>)(<\\w+>\\W?)?'; // eg. <br><strong>...
	const closingMarkup = '(\\W?<\\/\\w+.*?>){0,2}'; // eg. </strong></p>
	const wordSepPattern = '(&nbsp;|,|:|;)?\\s?'; // whitespace, &nbsp;, comma, colon, semi-colon
	const textHTMLMarkup = '(?:\\W?<\\/?[^>]*>){0,2}'; // any HTML markup <a href=...> </strong>, etc [matching stops as '>']
	const wordSequenceToMatch = words.join(`${textHTMLMarkup}${wordSepPattern}`); //words.join(`(?:\\W?<\\/?\\w+.*?>)?${wordSepPattern}`)
	const regex = new RegExp(
		`(${startingMarkupAndBreak}${wordSequenceToMatch}${closingMarkup})`,
		'gm',
	);

	Array.from(html.childNodes).forEach((el, indx) => {
		const htmlEl = el as HTMLElement;
		const htmlInner =
			htmlEl.innerHTML === undefined ? htmlEl.innerText : htmlEl.innerHTML;
		const match = regex.exec(htmlInner);

		if (match !== undefined && match !== null) {
			// Avoid infinite loops with zero-width matches
			if (match.index === regex.lastIndex) {
				regex.lastIndex++;
			} else {
				results.push({
					elementNumber: indx,
					startCharacter: match.index,
					endCharacter: match.index + match[0].length,
				});
			}
		}
	});
	return results;
}

export function extractCommonText(str1: string, str2: string): string {
	/* Return overlapping text between end of str1 and beginning of str2 */
	const separator = '@@@@@@';
	const pattern = new RegExp(`(.*)${separator}\\1`);
	const match = pattern.exec(str1 + separator + str2);
	if (match !== null) {
		return match[1];
	} else {
		return '';
	}
}
