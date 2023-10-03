/** @jsxImportSource @emotion/react */
import { Dispatch } from 'react';
import {
	ActionType,
	allRecipeFields,
	ingredientListFields,
	recipeMetaFields,
	schemaType,
} from '../interfaces/main';
import { apiURL } from '../consts';
import { actions } from '../actions/recipeActions';
import { fetchAndDispatch } from '../utils/requests';
import { Button } from '@guardian/source-react-components';
import fromPairs from 'lodash-es/fromPairs';
import { saveAsCsv } from '../utils/json-csv';
import flatten from 'lodash-es/flatten';

interface FooterProps {
	articleId: string | null;
	body: schemaType | null;
	dispatcher: Dispatch<ActionType>;
}

// replace nulls with empty list
const cleanRecipe = (data: recipeMetaFields | null) => {
	// const nullableFields = ['cuisineIds', 'occasion'] as Array<keyof recipeMetaFields>
	if (data !== null) {
		const out = Object.keys(data).map((field: keyof recipeMetaFields) => {
			if (['serves', 'image', 'recipes_title', 'description'].includes(field)) {
				return [field, data[field] ? data[field] : ''];
			} else {
				return [field, data[field] ? data[field] : []];
			}
		});
		return fromPairs(out);
		// nullableFields.forEach((field: keyof recipeMetaFields) => data[field] = data[field] ? data[field] : [])
	} else {
		return data;
	}
};

async function postRecipe(
	aId: string | null,
	data: allRecipeFields | null,
): Promise<Record<string, unknown>> {
	// async function postRecipe(aId: string|null, data: Record<string, unknown>|null): Promise<Record<string, unknown>>{
	if (aId === null) {
		console.warn('No url provided!');
		return { error: 'No url provided.' };
	} else if (data === null) {
		console.warn('No data provided!');
		return { error: 'No data provided.' };
	}
	const articleUrl = aId.replace(/^\/+/, '');
	const response = await fetch(`${location.origin}${apiURL}${articleUrl}`, {
		method: 'POST', // *GET, POST, PUT, DELETE, etc.
		mode: 'cors', // no-cors, *cors, same-origin
		cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
		credentials: 'same-origin', // include, *same-origin, omit
		headers: {
			'Content-Type': 'application/json',
		},
		redirect: 'follow', // manual, *follow, error
		referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
		body: JSON.stringify(cleanRecipe(data)), // body data type must match "Content-Type" header
	});
	return { status: response.status }; //.json(); // parses JSON response into native JavaScript objects
}

function resetRecipe(
	aId: string | null,
	dispatcher: Dispatch<ActionType>,
): void {
	if (aId === null) {
		console.warn('No url provided!');
		dispatcher({
			type: actions.error,
			payload: '[Reset] Error: No article id provided.',
		});
	} else {
		const articleUrl = aId.replace(/^\/+/, '');
		void fetchAndDispatch(
			`${location.origin}/api/db/${articleUrl}`,
			actions.init,
			'body',
			dispatcher,
		);
	}
}

function formatCSV(
	data: allRecipeFields,
): [Record<string, string>[], Record<string, string>] {
	const ingreds = data['ingredients_lists'].map(
		(ingL: ingredientListFields, i: number) => {
			return ingL['ingredients'].map((ingred) => {
				return {
					list_number: i,
					list_title: ingL['title'],
					ingredient: ingred['text'],
				};
			});
		},
	);
	const fields = {
			title: 'recipes_title',
			list_title: 'list_title',
			list_number: 'list_number',
			ingredient: 'ingredient',
		},
		dataFormatted = flatten(ingreds).map((ing) => {
			return { title: data['recipes_title'], ...ing };
		});

	return [dataFormatted, fields];
}

function Footer(props: FooterProps): JSX.Element | JSX.Element[] {
	const { articleId, body, dispatcher } = props;

	function submit(event: React.MouseEvent<HTMLInputElement>): void {
		event.preventDefault();
		postRecipe(articleId, body).catch((err) => console.error(err));
	}

	function reset(event: React.MouseEvent<HTMLInputElement>): void {
		event.preventDefault();
		resetRecipe(articleId, dispatcher);
	}

	function downloadCSV(event: React.MouseEvent<HTMLInputElement>): void {
		event.preventDefault();
		const [data, fields] = formatCSV(body);
		const aId = articleId !== null ? articleId : undefined;
		saveAsCsv({
			data: data,
			fields: fields,
			fileformat: undefined,
			filename: aId,
			separator: ';',
		});
	}

	return (
		<form>
			<Button priority="primary" size="xsmall" onClick={submit}>
				Save
			</Button>
			<Button priority="secondary" size="xsmall" onClick={reset}>
				Reset
			</Button>
			<Button priority="tertiary" size="xsmall" onClick={downloadCSV}>
				Download as CSV
			</Button>
		</form>
	);
}
export default Footer;
