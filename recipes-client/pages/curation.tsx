/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { space, palette } from '@guardian/source-foundations';
import RecipeComponent from '../components/recipe-component';
import GuFrame from '../components/gu-frame';
import ImagePicker from '../components/form/form-image-picker';
import Footer from '../components/footer';

import { useParams } from 'react-router-dom';

import { recipeReducer, defaultState } from '../reducers/recipe-reducer';
import { actions } from '../actions/recipeActions';
import { apiURL, capiProxy, schemaEndpoint } from '../consts/index';
import { useEffect } from 'react';
import { useImmerReducer } from 'use-immer';
import { fetchAndDispatch, setLoadingFinished } from '../utils/requests';

// Styles

const gridLayout = css`
	display: grid;
	grid-template-columns: 25% 25% 25% 25%;
	height: 100vh;
	grid-template-rows: 30px 1fr 50px;
	grid-template-areas: 'header header header header' 'left left right right' 'footer footer footer footer';
`;

const articleView = css`
	grid-area: left;
	background: ${palette.neutral[100]};
	overflow: auto;
	padding: 0 ${space[5]}px;
`;

const dataView = css`
	grid-area: right;
	background: lightgray;
	overflow: auto;
	padding: 5px;
`;

const footer = css`
	grid-area: footer;
	background: ${palette.brand[400]};
	justify-items: center;
	display: grid;
	align-items: center;
`;

const Curation = () => {
	const { section, '*': path } = useParams<{
		section: string;
		'*': string;
	}>();
	const articleId = section && path ? `/${section}/${path}` : '';
	const [state, dispatch] = useImmerReducer(recipeReducer, defaultState);
	const image = state.body === null ? null : state.body.image;
	const recipeId = state.body === null ? null : state.body.recipeId;
	const articlePath = state.body === null ? articleId : state.body.path;

	useEffect(() => {
		const articleUrl = articleId.replace(/^\/+/, '');
		Promise.all([
			// Get schema
			fetchAndDispatch(
				`${location.origin}${apiURL}${schemaEndpoint}`,
				actions.init,
				'schema',
				dispatch,
			),
			// Get parsed recipe items
			fetchAndDispatch(
				`${location.origin}/api/db/${articleUrl}`,
				actions.init,
				'body',
				dispatch,
			),
			// Get article content
			fetchAndDispatch(
				`${location.origin}${capiProxy}${articleUrl}`,
				actions.init,
				'html',
				dispatch,
			),
		])
			.then(() => setLoadingFinished(dispatch))
			.catch((err) => {
				console.error(err);
			});
	}, [articleId, dispatch]);

	return (
		<div css={gridLayout}>
			<div css={articleView}>
				<GuFrame articlePath={articleId} />
			</div>
			<div css={dataView}>
				<ImagePicker
					html={state.html}
					selected={image}
					isLoading={state.isLoading}
					dispatcher={dispatch}
				/>
				<form>
					<RecipeComponent
						isLoading={state.isLoading}
						body={state.body}
						schema={state.schema}
						dispatcher={dispatch}
					/>
				</form>
			</div>
			<div css={footer}>
				<Footer articleId={articleId} body={state.body} dispatcher={dispatch} />
			</div>
		</div>
	);
};

export default Curation;
