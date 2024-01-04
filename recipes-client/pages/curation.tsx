/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { space, palette } from '@guardian/source-foundations';
import RecipeComponent from '../components/curation/recipe-component';
import GuFrame from '../components/curation/gu-frame';
import ImagePicker from '../components/form/form-image-picker';
import CurationOptionsBar, {
	postRecipe,
} from '../components/curation/curation-options-bar';

import { useParams } from 'react-router-dom';

import { recipeReducer, defaultState } from '../reducers/recipe-reducer';
import { actions } from '../actions/recipeActions';
import { apiURL, capiProxy, schemaEndpoint } from '../consts/index';
import { useEffect, useState } from 'react';
import { useImmerReducer } from 'use-immer';
import { fetchAndDispatch, setLoadingFinished } from '../utils/requests';
import { Tabs } from '@guardian/source-react-components-development-kitchen';
import { DataPreview } from 'components/preview/data-preview';
import { PinboardTrackAndPreselect } from '../components/curation/pinboard-track-and-preselect';
import { ImageObject } from 'interfaces/main';
import { useIdleTimer } from 'react-idle-timer';
import { useNavigate } from 'react-router-dom';
import { CurationPanel } from 'components/form/form-curation-panel';

const Curation = () => {
	const { section: id } = useParams();
	const articleId = id ? `/${id}` : '';
	const [state, dispatch] = useImmerReducer(recipeReducer, defaultState);
	const [capiId, setCapiId] = useState<string | null>(null);
	const [selectedImage, setSelectedImage] = useState<ImageObject | null>(null);
	const scrubbedId = articleId.replace(/^\/+/, '');

	const [selectedTab, setSelectedTab] = useState('summary');

	// idle timer
	const [remaining, setRemaining] = useState<number>(0);
	const [openAlert, setOpenAlert] = useState<boolean>(false);
	const timeout = 120000; // 2 minutes
	const promptBeforeIdle = 60000; // 1 minute
	const navigate = useNavigate();

	const onIdle = () => {
		setOpenAlert(false);
		navigate('/');
	};

	const onActive = () => {
		setOpenAlert(false);
	};
	const onPrompt = () => {
		setOpenAlert(true);
	};

	const { getRemainingTime, activate } = useIdleTimer({
		onIdle,
		onActive,
		onPrompt,
		timeout,
		promptBeforeIdle,
		throttle: 500,
	});

	const handleStillHere = () => {
		activate();
	};

	useEffect(() => {
		const interval = setInterval(() => {
			setRemaining(Math.ceil(getRemainingTime() / 1000));
		}, 500);

		return () => {
			clearInterval(interval);
		};
	});

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
		}, 60000);
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
				setSelectedImage(state.body.featuredImage);
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
						selectedImage={selectedImage}
						setSelectedImage={setSelectedImage}
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
				<div
					className="modal"
					style={{
						display: openAlert ? 'flex' : 'none',
						zIndex: '100',
						width: '20em',
						border: '2px solid gray',
						background: 'white',
						fontFamily: 'GuardianTextSans',
						borderRadius: '1em',
						padding: '1em',
						position: 'absolute',
						flexDirection: 'column',
						alignItems: 'center',
						left: 'calc(50vw - 10em)',
						right: 'calc(50vh - 10em)',
					}}
				>
					<h3>Are you still here?</h3>
					<p>Redirecting in {remaining} seconds</p>
					<button
						css={{ fontFamily: 'GuardianTextSans' }}
						onClick={handleStillHere}
					>
						I'm still here!
					</button>
				</div>
				<CurationOptionsBar
					articleId={articleId}
					body={state.body}
					dispatcher={dispatch}
				/>
			</div>
			<div css={articleView}>{capiId && <GuFrame articlePath={capiId} />}</div>
			<div css={dataView}>
				{state.body && (
					<CurationPanel
						isLoading={state.isLoading}
						body={state.body}
						dispatcher={dispatch}
					/>
				)}
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
			<PinboardTrackAndPreselect
				maybeComposerId={state?.body?.composerId}
				maybeTitle={state?.body?.title}
			/>
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
