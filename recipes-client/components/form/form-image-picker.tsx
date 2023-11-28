/** @jsxImportSource @emotion/react */
import { useState } from 'react';
import { Dispatch } from 'react';
import CheckButton from '../reusables/check-button';
import { ActionType } from '../../interfaces/main';
import minBy from 'lodash-es/minBy';
import { actions } from '../../actions/recipeActions';

type assetsInfo = {
	assets: imageInfo[];
};

type imageInfo = {
	typeData: typeDataTypes;
	file: string;
};

type typeDataTypes = {
	height: string;
	width: string;
};

const findSmallestVersion = (assets: imageInfo[]): imageInfo => {
	/* Return asset with smallest 'width' */
	return minBy(assets, ({ typeData }) => typeData.width);
};

const getPictureUrls = (elems: assetsInfo[] | undefined): string[] => {
	if (elems === undefined) {
		return [];
	} else {
		return Array.from(
			elems.reduce((acc, el) => {
				const smallestAsset = findSmallestVersion(el['assets']);
				if ('file' in smallestAsset) {
					acc.add(smallestAsset['file']);
				}
				return acc;
			}, new Set<string>()),
		);
	}
};

const getPictureIds = (elems: assetsInfo[] | undefined): string[] => {
	if (elems === undefined) {
		return [];
	} else {
		return Array.from(
			elems.reduce((acc, el) => {
				if ('id' in el) {
					acc.add(el['id']);
				}
				return acc;
			}, new Set<string>()),
		);
	}
};

const select = (
	objId: string,
	isSelected: boolean,
	dispatcher: Dispatch<ActionType>,
): void => {
	const obj = isSelected ? null : objId;
	dispatcher({
		type: actions.selectImg,
		payload: obj,
	});
};

interface PictureGridProps {
	picUrls: string[];
	picIds: string[];
	selected: string | null;
	dispatcher: Dispatch<ActionType>;
}

const PictureGrid = ({
	picUrls,
	picIds,
	selected,
	dispatcher,
}: PictureGridProps) => {
	const [picHovered, setHover] = useState(-1);
	return (
		<>
			<h3 css={{ fontFamily: 'GuardianTextSans' }}>
				Available pictures for the featured image
			</h3>
			<div
				css={{
					display: 'grid',
					gridTemplateColumns: '20% 20% 20% 20% 20%',
					gridTemplateRows: 'auto',
					height: 'auto',
					// gridTemplateRows: "40px 1fr 30px",
					gridTemplateAreas: `"1" "2" "3" "4" "5"`,
					marginBottom: '30px',
					borderColor: 'black',
					borderWidth: '2px',
				}}
			>
				{picUrls.map((p, i) => {
					return (
						<div
							onMouseOver={() => setHover(i)}
							onMouseOut={() => setHover(-1)}
							onClick={() =>
								select(picUrls[i], picUrls[i] === selected, dispatcher)
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
							<img style={{ maxWidth: 'inherit' }} src={p} alt={p} />
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
									isSelected={picUrls[i] === selected}
									hover={i === picHovered}
								/>
							</div>
						</div>
					);
				})}
			</div>
			<hr />
		</>
	);
};

interface ImagePickerProps {
	isLoading: boolean;
	html: Record<string, unknown> | null;
	selected: string | null;
	dispatcher: Dispatch<ActionType>;
}

const ImagePicker = ({
	isLoading,
	html,
	selected,
	dispatcher,
}: ImagePickerProps): JSX.Element => {
	if (isLoading || html === null) {
		return <h3> Loading pictures... </h3>;
	} else {
		const picUrls = getPictureUrls(html['elements']);
		const picIds = getPictureIds(html['elements']);

		return (
			<PictureGrid
				picUrls={picUrls}
				picIds={picIds}
				selected={selected}
				dispatcher={dispatcher}
			/>
		);
	}
};

export default ImagePicker;
