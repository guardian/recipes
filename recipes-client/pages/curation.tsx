/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { space, palette } from '@guardian/source-foundations';
import RecipeComponent from '../components/recipe-component';
import GuFrame from '../components/gu-frame';
import ImagePicker from '../components/form/form-image-picker';
import CurationOptionsBar, {
	postRecipe,
} from '../components/curation-options-bar';

import { useParams } from 'react-router-dom';

import { recipeReducer, defaultState } from '../reducers/recipe-reducer';
import { actions } from '../actions/recipeActions';
import { apiURL, capiProxy, schemaEndpoint } from '../consts/index';
import { useEffect, useState } from 'react';
import { useImmerReducer } from 'use-immer';
import { fetchAndDispatch, setLoadingFinished } from '../utils/requests';
import { Tabs } from '@guardian/source-react-components-development-kitchen';
import { DataPreview } from 'components/preview/data-preview';

const Curation = () => {
	const { section: id } = useParams();
	const articleId = id ? `/${id}` : '';
	const [state, dispatch] = useImmerReducer(recipeReducer, defaultState);
	const [capiId, setCapiId] = useState<string | null>(null);
	const image = state.body === null ? null : state.body.featuredImage;
	const scrubbedId = articleId.replace(/^\/+/, '');

	const [selectedTab, setSelectedTab] = useState('summary');

	useEffect(() => {
		const interval = setInterval(() => {
			postRecipe(articleId, state.body)
				.catch((err) => console.error(err))
				.then(() =>
					fetchAndDispatch(
						`${location.origin}/api/db/${scrubbedId}`,
						actions.init,
						'body',
						dispatch,
					),
				);
		}, 10000);
		return () => clearInterval(interval);
	}, [state]);

	useEffect(() => {
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
				`${location.origin}/api/db/${scrubbedId}`,
				actions.init,
				'body',
				dispatch,
			),
		])
			.then(() => {
				// Get article content
				if (state.body === null) {
					return;
				}
				setCapiId(state.body.canonicalArticle);
				fetchAndDispatch(
					`${location.origin}${capiProxy}/${state.body.canonicalArticle}`,
					actions.init,
					'html',
					dispatch,
				);
				setLoadingFinished(dispatch);
			})
			.catch((err) => {
				console.error(err);
			});
	}, [articleId, dispatch, state?.body?.canonicalArticle]);

	const tabsContent = [
		{
			id: 'summary',
			text: 'Summary',
			content: <DataPreview recipeData={state.body} />,
		},
		{
			id: 'edit',
			text: 'Edit',
			content: (
				<>
					<ImagePicker
						html={state.html}
						selected={image}
						isLoading={state.isLoading}
						dispatcher={dispatch}
					/>
					<form>
						{state.body && (
							<RecipeComponent
								isLoading={state.isLoading}
								body={state.body}
								schema={state.schema}
								dispatcher={dispatch}
							/>
						)}
					</form>
				</>
			),
		},
	];

	return (
		<div css={gridLayout}>
			<div css={footer}>
				<CurationOptionsBar
					articleId={articleId}
					body={state.body}
					dispatcher={dispatch}
				/>
			</div>
			<div css={articleView}>{capiId && <GuFrame articlePath={capiId} />}</div>
			<div css={dataView}>
				<Tabs
					tabsLabel="Toggle between form and preview"
					tabElement="button"
					tabs={tabsContent}
					selectedTab={selectedTab}
					onTabChange={(tabId: string): void => {
						setSelectedTab(tabId);
					}}
				></Tabs>
			</div>
		</div>
	);
};

export default Curation;

const gridLayout = css`
	display: grid;
	grid-template-columns: 25% 25% 25% 25%;
	height: 100vh;
	grid-template-rows: 50px 1fr;
	grid-template-areas: 'footer footer footer footer' 'left left right right';
	row-gap: 30px;
`;

const articleView = css`
	grid-area: left;
	background: ${palette.neutral[100]};
	overflow: auto;
	padding: 0 ${space[5]}px;
`;

const dataView = css`
	grid-area: right;
	overflow: auto;
	padding: 5px;
`;

const footer = css`
	grid-area: footer;
	background: ${palette.brand[400]};
	justify-items: center;
	display: grid;
	align-items: center;
	border-top: 1px solid ${palette.neutral[86]};
`;
