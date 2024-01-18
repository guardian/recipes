/** @jsxImportSource @emotion/react */
import { Dispatch } from 'react';
import { ActionType, AllRecipeFields } from '../../interfaces/main';
import { apiURL } from '../../consts';
import { actions } from '../../actions/recipeActions';
import { fetchAndDispatch } from '../../utils/requests';
import { Button } from '@guardian/source-react-components';

interface FooterProps {
	articleId: string | null;
	body: AllRecipeFields | null;
	dispatcher: Dispatch<ActionType>;
}

export const postRecipe = async (
	aId: string | null,
	data: AllRecipeFields | null,
): Promise<Record<string, unknown> | void> => {
	if (aId === null) {
		console.warn('No url provided!');
		return { error: 'No url provided.' };
	} else if (data === null) {
		console.warn('No data provided!');
		return { error: 'No data provided.' };
	}
	const recipeId = aId.replace(/^\/+/, '');

	try {
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

		if (!response.ok) {
			alert(
				'Oops, a hiccup in the kitchen, recipe was not saved, sorry 😢\nPlease contact engineers if problem persists 🚑',
			);
		}
	} catch (error) {
		console.error(error);
		alert(
			'An error occurred, recipe was not saved, sorry 😢. Contact engineers if problem persists.',
		);
	}

	// return { status: response.status }; //.json(); // parses JSON response into native JavaScript objects
};

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
		const articleUrl = aId.replace(/^\/+/, '');
		void fetchAndDispatch(
			`${location.origin}/api/db/${articleUrl}`,
			actions.init,
			'body',
			dispatcher,
		);
	}
};

const CurationOptionsBar = ({ articleId, body, dispatcher }: FooterProps) => {
	const submit = (
		event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
	): void => {
		event.preventDefault();
		postRecipe(articleId, body).catch((err) => console.error(err));
	};

	const reset = (
		event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
	): void => {
		event.preventDefault();
		resetRecipe(articleId, dispatcher);
	};

	return (
		<form>
			<Button priority="primary" size="xsmall" onClick={submit}>
				Save
			</Button>
			<Button priority="secondary" size="xsmall" onClick={reset}>
				Reset
			</Button>
		</form>
	);
};
export default CurationOptionsBar;
