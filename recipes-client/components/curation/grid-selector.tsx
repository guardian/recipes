/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { palette } from '@guardian/source-foundations';
import { apiURL } from 'consts';
import { ImageObject } from 'interfaces/main';
import React from 'react';
import { useEffect, useState } from 'react';

// TODO: Vary based on stage
const gridOrigin = 'https://media.test.dev-gutools.co.uk';

export const isValidGridUrl = (url: string): boolean => {
	return url.startsWith(gridOrigin);
};

const isValidCropUrl = (url: string): boolean => {
	return url.startsWith(gridOrigin) && new URL(url).searchParams.has('crop');
};

export const useGridSelector = (): [
	JSX.Element | null,
	(startingUrl?: string) => Promise<ImageObject | null>,
] => {
	const [iframeStartingUrl, setIframeStartingUrl] = useState<string>(
		`${gridOrigin}/?cropType=all`,
	);
	const [promiseResolveFn, setPromiseResolveFn] = useState<
		((value: ImageObject | null) => void) | null
	>(null);
	useEffect(() => {
		if (!promiseResolveFn) return;
		const handleSelectedCrop = async (event: MessageEvent) => {
			if (event.origin !== gridOrigin) return;
			const { data } = event;
			const cropId = data?.crop.data.id;
			const mediaApiUri = data?.image.uri;
			const { data: imageData } = (await (
				await fetch(mediaApiUri, {
					credentials: 'include',
				})
			).json()) as {
				data: {
					exports: {
						id: string;
						assets: { dimensions: { width: number }; file: string }[];
						master: { file: string };
					}[];
					id: string;
					metadata: { credit: string; description: string };
				};
			};
			const cropExport = imageData.exports.find((crop) => crop.id === cropId)!;
			const preferredAsset =
				cropExport.assets.find((asset) => asset.dimensions.width === 1000) ||
				cropExport.assets.find((asset) => asset.dimensions.width === 500) ||
				cropExport.master;
			const imageObject: ImageObject = {
				url: preferredAsset.file,
				mediaId: imageData.id,
				cropId,
				source: imageData.metadata.credit,
				// photographer: string | undefined;
				// imageType: string | undefined;
				caption: imageData.metadata.description,
				mediaApiUri,
			};
			promiseResolveFn(imageObject);
			setPromiseResolveFn(null);
			// TODO: Support dragging and dropping images into Hatch
			// TODO: Make iframe path based on dropped URL
			// TODO: Shortcut to fetch step if crop URL dropped
		};
		window.addEventListener('message', handleSelectedCrop);
		return () => window.removeEventListener('message', handleSelectedCrop); // Cleanup/unmount function
	}, [promiseResolveFn]);
	const maybeElement = promiseResolveFn && (
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
				onClick={() => {
					promiseResolveFn(null);
					setPromiseResolveFn(null);
				}}
				css={css`
					position: absolute;
					top: 40px;
					right: 40px;
				`}
			>
				Close
			</button>
			<iframe
				src={iframeStartingUrl}
				css={css`
					width: calc(100% - 100px);
					height: calc(100vh - 100px);
					display: block;
					margin: 50px;
				`}
			/>
		</div>
	);
	const callback = (startingUrl?: string) =>
		new Promise<ImageObject>((resolve) => {
			setIframeStartingUrl(startingUrl || `${gridOrigin}/?cropType=all`);
			// must use the function overload of setState here, to avoid resolve being invoked immediately
			setPromiseResolveFn(() => resolve);
		});
	return [maybeElement, callback];
};
