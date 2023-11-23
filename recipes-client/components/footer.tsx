/** @jsxImportSource @emotion/react */
import { Dispatch } from 'react';
import {
	ActionType,
	AllRecipeFields,
	IngredientsGroup,
	RecipeFields,
	SchemaType,
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
	body: AllRecipeFields | null;
	dispatcher: Dispatch<ActionType>;
}

// // replace nulls with empty list
// const cleanRecipe = (data: RecipeFields | null) => {
//   // const nullableFields = ['cuisineIds', 'celebrationIds'] as Array<keyof recipeMetaFields>
//   if (data !== null) {
//     const out = Object.keys(data).map((field: keyof RecipeFields) => {
//       if (['serves', 'image', 'title', 'description'].includes(field)) {
//         return [field, data[field] ? data[field] : ''];
//       } else {
//         return [field, data[field] ? data[field] : []];
//       }
//     });
//     return fromPairs(out);
//     // nullableFields.forEach((field: keyof recipeMetaFields) => data[field] = data[field] ? data[field] : [])
//   } else {
//     return data;
//   }
// };

export async function postRecipe(
	aId: string | null,
	data: AllRecipeFields | null,
): Promise<Record<string, unknown>> {
	// async function postRecipe(aId: string|null, data: Record<string, unknown>|null): Promise<Record<string, unknown>>{
	console.log('Data: ' + JSON.stringify(data));
	if (aId === null) {
		console.warn('No url provided!');
		return { error: 'No url provided.' };
	} else if (data === null) {
		console.warn('No data provided!');
		return { error: 'No data provided.' };
	}
	const recipeId = aId.replace(/^\/+/, '');
	const response = await fetch(`${location.origin}${apiURL}${recipeId}`, {
		method: 'POST', // *GET, POST, PUT, DELETE, etc.
		mode: 'cors', // no-cors, *cors, same-origin
		cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
		credentials: 'same-origin', // include, *same-origin, omit
		headers: {
			'Content-Type': 'application/json',
		},
		redirect: 'follow', // manual, *follow, error
		referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
		body: JSON.stringify(data), // body data type must match "Content-Type" header
	});
	return { status: response.status }; //.json(); // parses JSON response into native JavaScript objects
}

const resetRecipe = (
	aId: string | null,
	dispatcher: Dispatch<ActionType>,
): void => {
	if (aId === null) {
		console.warn('No url provided!');
		dispatcher({
			type: actions.error,
			payload: '[Reset] Error: No article id provided.',
		});
	} else {
		const recipeId = aId.replace(/^\/+/, '');
		void fetchAndDispatch(
			`${location.origin}/api/db-raw/${recipeId}`,
			actions.init,
			'body',
			dispatcher,
		);
	}
};

// const formatCSV = (
//   data: AllRecipeFields,
// ): [Record<string, string>[], Record<string, string>] => {
//   const ingreds = data['ingredients'].map(
//     (ingL: IngredientsGroup, i: number) => {
//       return ingL['ingredientsList'].map((ingred) => {
//         return {
//           list_number: i,
//           list_title: ingL['title'],
//           ingredient: ingred['text'],
//         };
//       });
//     },
//   );
//   const fields = {
//     title: 'title',
//     list_title: 'list_title',
//     list_number: 'list_number',
//     ingredient: 'ingredient',
//   },
//     dataFormatted = flatten(ingreds).map((ing) => {
//       return { title: data['title'], ...ing };
//     });

//   return [dataFormatted, fields];
// };

const Footer = ({ articleId, body, dispatcher }: FooterProps) => {
	const submit = (event: React.MouseEvent<HTMLInputElement>): void => {
		event.preventDefault();
		postRecipe(articleId, body).catch((err) => console.error(err));
	};

	const reset = (event: React.MouseEvent<HTMLInputElement>): void => {
		if (
			!window.confirm(
				'Are you sure you want to reset? Doing so will return this recipe data to the original raw state produced by our machine learning model. Any edits you have made will be lost.',
			)
		) {
			event.preventDefault();
			return;
		}
		event.preventDefault();
		resetRecipe(articleId, dispatcher);
	};

	// const downloadCSV = (event: React.MouseEvent<HTMLInputElement>): void => {
	//   event.preventDefault();
	//   const [data, fields] = formatCSV(body);
	//   const aId = articleId !== null ? articleId : undefined;
	//   saveAsCsv({
	//     data: data,
	//     fields: fields,
	//     fileformat: undefined,
	//     filename: aId,
	//     separator: ';',
	//   });
	// };

	return (
		<form>
			<Button priority="primary" size="xsmall" onClick={submit}>
				Save
			</Button>
			<Button priority="secondary" size="xsmall" onClick={reset}>
				Reset
			</Button>
			{/* <Button priority="secondary" size="xsmall" onClick={downloadCSV}>
				Download as CSV
			</Button> */}
		</form>
	);
};
export default Footer;
