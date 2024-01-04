/** @jsxImportSource @emotion/react */
import { useState } from 'react';
import { Dispatch } from 'react';
import CheckButton from '../reusables/check-button';
import { ActionType } from '../../interfaces/main';
import minBy from 'lodash-es/minBy';
import { actions } from '../../actions/recipeActions';
import { ImageObject } from '../../interfaces/main';
import { WithGridSelector } from 'components/curation/grid-selector';
import { css } from '@emotion/react';

type assetsInfo = {
	assets: imageInfo[];
};

type imageInfo = {
	typeData: typeDataTypes;
	file: string;
};

type typeDataTypes = {
	altText: string;
	caption: string;
	credit: string;
	displayCredit: string;
	height: string;
	imageType: string;
	mediaApiUri: string;
	mediaId: string;
	secureFile: string;
	source: string;
	width: string;
};

const findSmallestVersion = (assets: imageInfo[]): imageInfo => {
	/* Return asset with smallest 'width' */
	return minBy(assets, ({ typeData }) => typeData.width);
};

const inferCropId = (url: string): string => {
	const parts = url.split('/');
	const cropId = parts[parts.length - 2];
	if (cropId !== undefined) {
		return cropId;
	} else {
		console.error('Could not infer cropId from url: ', url);
		return '';
	}
};

const getPictureObjects = (elems: assetsInfo[] | undefined): ImageObject[] => {
	if (elems === undefined) {
		return [];
	} else {
		return elems.reduce((acc, el) => {
			const smallestAsset = findSmallestVersion(el.assets);
			if (smallestAsset.file) {
				acc.push({
					url: smallestAsset.file,
					mediaId: smallestAsset.typeData.mediaId,
					cropId: inferCropId(smallestAsset.file),
					source: smallestAsset.typeData.source,
					photographer: smallestAsset.typeData.displayCredit,
					imageType: smallestAsset.typeData.imageType,
					caption: smallestAsset.typeData.caption,
					mediaApiUri: smallestAsset.typeData.mediaApiUri,
				});
			}
			return acc;
		}, [] as ImageObject[]);
	}
};

const select = (
	imageObject: ImageObject,
	isSelected: boolean,
	setSelectedImage: Dispatch<ImageObject | null>,
	dispatcher: Dispatch<ActionType>,
): void => {
	const obj = isSelected ? null : imageObject;
	setSelectedImage(obj);
	dispatcher({
		type: actions.selectImg,
		payload: obj,
	});
};

interface PictureGridProps {
	picObjects: ImageObject[];
	selectedImage: ImageObject | null;
	setSelectedImage: Dispatch<ImageObject | null>;
	dispatcher: Dispatch<ActionType>;
}

const PictureGrid = ({
	picObjects,
	selectedImage,
	setSelectedImage,
	dispatcher,
}: PictureGridProps) => {
	const [picHovered, setHover] = useState(-1);
	return (
		<>
			<h3 css={{ fontFamily: 'GuardianTextSans' }}>
				Images featured in the canonical article
			</h3>
			<WithGridSelector
				callback={(chosenImage) => {
					console.log(chosenImage); // TODO - do something with this such as save it etc.
				}}
			>
				<div
					css={css`
						position: relative;
						display: grid;
						grid-template-columns: 20% 20% 20% 20% 20%;
						grid-template-rows: auto;
						height: auto;
						grid-template-areas: '1' '2' '3' '4' '5';
						margin-bottom: 30px;
						border-color: black;
						border-width: 2px;
					`}
				>
					{picObjects.map((p, i) => {
						return (
							<div
								onMouseOver={() => setHover(i)}
								onMouseOut={() => setHover(-1)}
								onClick={() =>
									select(
										picObjects[i],
										picObjects[i] === selectedImage,
										setSelectedImage,
										dispatcher,
									)
								}
								css={{
									gridArea: `${Math.floor(i / 5 + 1)}`,
									justifyItems: 'center',
									display: 'grid',
									align: 'center',
									maxWidth: '100%',
									alignContent: 'center',
									borderColor: 'black',
									borderWidth: '1px',
									cursor: 'pointer',
									pointerEvents: 'visible',
								}}
								key={`img_${i}`}
							>
								<img style={{ maxWidth: 'inherit' }} src={p.url} alt={p.url} />
								<div
									key={`tile-icon-bar-${i}`}
									style={{
										pointerEvents: 'none',
										opacity: 1,
										position: 'relative',
										top: '-90px',
										height: '36px',
										width: '100%',
									}}
								>
									<CheckButton
										isSelected={picObjects[i]?.url === selectedImage?.url}
										hover={i === picHovered}
									/>
								</div>
							</div>
						);
					})}
				</div>
			</WithGridSelector>
			<hr />
		</>
	);
};

interface ImagePickerProps {
	isLoading: boolean;
	html: Record<string, unknown> | null;
	selectedImage: ImageObject | null;
	setSelectedImage: (img: ImageObject | null) => void;
	dispatcher: Dispatch<ActionType>;
}

const ImagePicker = ({
	isLoading,
	html,
	selectedImage,
	setSelectedImage,
	dispatcher,
}: ImagePickerProps): JSX.Element => {
	if (isLoading || html === null) {
		return <h3> Loading pictures... </h3>;
	} else {
		const picObjects = getPictureObjects(html.elements as assetsInfo[]);

		return (
			<PictureGrid
				picObjects={picObjects}
				selectedImage={selectedImage}
				setSelectedImage={setSelectedImage}
				dispatcher={dispatcher}
			/>
		);
	}
};

export default ImagePicker;
