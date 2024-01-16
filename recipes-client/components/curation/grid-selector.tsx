/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { ImageObject } from 'interfaces/main';
import React, { useEffect, useState } from 'react';

const gridTopLevelDomain = window.location.hostname.includes('.gutools.co.uk')
	? 'gutools.co.uk'
	: 'test.dev-gutools.co.uk';
const gridOrigin = `https://media.${gridTopLevelDomain}`;

type WithGridSelectorProps = React.PropsWithChildren<{
	callback: (chosenImage: ImageObject) => void;
}>;
export const WithGridSelector = ({
	children,
	callback,
}: WithGridSelectorProps) => {
	const [maybeIframeUrl, setMaybeIframeUrl] = useState<string | null>(null);
	const [isDropTarget, setIsDropTarget] = useState(false);

	const handleSelectedCrop = async (cropId: string, mediaApiUri: string) => {
		const mediaApiResponse = await fetch(mediaApiUri, {
			credentials: 'include',
		});
		if (!mediaApiResponse.ok) {
			console.error(
				'Could not fetch media-api response for ',
				mediaApiUri,
				mediaApiResponse,
			);
			alert('Could not load data from the Grid. Please try again.');
			return;
		}
		const { data } = (await mediaApiResponse.json()) as {
			data: {
				exports: {
					id: string;
					assets: { dimensions: { width: number }; secureUrl: string }[];
					master: { secureUrl: string };
				}[];
				id: string;
				metadata: { credit: string; description: string; byline: string };
			};
		};
		const cropExport = data.exports.find((crop) => crop.id === cropId)!;
		const preferredAsset =
			cropExport.assets.find((asset) => asset.dimensions.width === 1000) ||
			cropExport.assets.find((asset) => asset.dimensions.width === 500) ||
			cropExport.master;
		const imageObject: ImageObject = {
			url: preferredAsset.secureUrl,
			mediaId: data.id,
			cropId,
			source: data.metadata.credit,
			photographer: data.metadata.byline,
			// imageType: string | undefined; //TODO extract imageType from media-api response
			caption: data.metadata.description,
			mediaApiUri,
		};
		setMaybeIframeUrl(null);
		callback(imageObject);
	};

	useEffect(() => {
		const handleGridMessage = (event: MessageEvent) =>
			event.origin === gridOrigin &&
			event.data &&
			handleSelectedCrop(event.data.crop.data.id, event.data.image.uri);
		window.addEventListener('message', handleGridMessage);
		return () => window.removeEventListener('message', handleGridMessage); // Cleanup/unmount function
	}, []);

	const start = (startingUrl: string = `${gridOrigin}/?cropType=all`) => {
		const url = new URL(startingUrl);
		const maybeCropId = url.searchParams.get('crop');
		if (maybeCropId) {
			handleSelectedCrop(
				maybeCropId,
				`https://api.${url.hostname}/${url.pathname}`,
			);
		} else {
			setMaybeIframeUrl(startingUrl);
		}
	};

	return (
		<div
			css={css`
				position: relative;
			`}
			onDragEnter={(e) => {
				if (e.dataTransfer.types.includes('text/uri-list')) {
					e.preventDefault();
					e.stopPropagation();
					setIsDropTarget(true);
				}
			}}
			onDragOver={(e) => e.preventDefault()}
			onDrop={(e) => {
				e.preventDefault();
				start(e.dataTransfer.getData('URL'));
				setIsDropTarget(false);
			}}
		>
			{children}
			<button
				onClick={() => start()}
				css={css`
					font-size: 40px;
				`}
			>
				➕
			</button>
			{isDropTarget && (
				<div
					css={css`
						position: absolute;
						top: 0;
						left: 0;
						width: 100%;
						height: 100%;
						background: rgba(0, 0, 0, 0.5);
						border: 2px dashed black;
					`}
					onDragLeave={() => setIsDropTarget(false)}
					onDragEnd={() => setIsDropTarget(false)}
					onDragExit={() => setIsDropTarget(false)}
				/>
			)}
			{maybeIframeUrl && (
				<div
					css={css`
						background-color: rgba(0, 0, 0, 0.5);
						position: fixed;
						bottom: 0;
						top: 0;
						left: 0;
						right: 0;
						z-index: 999999;
					`}
				>
					<button
						onClick={() => setMaybeIframeUrl(null)}
						css={css`
							position: absolute;
							top: 40px;
							right: 40px;
						`}
					>
						Close
					</button>
					<iframe
						src={maybeIframeUrl}
						css={css`
							width: calc(100% - 100px);
							height: calc(100vh - 100px);
							display: block;
							margin: 50px;
						`}
					/>
				</div>
			)}
		</div>
	);
};
