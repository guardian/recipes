/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { palette } from '@guardian/source-foundations';
import {
	SvgCrossRound,
	SvgTickRound,
	SvgExternal,
} from '@guardian/source-react-components';
import { curationEndpoint } from '../consts/index';

interface RecipeListProps {
	list: RecipeListType[];
}

interface RecipeListType {
	id: string;
	title: string;
	contributors: string[];
	canonicalArticle: string;
	isAppReady: boolean;
}

const RecipeList = ({ list }: RecipeListProps): JSX.Element => {
	return (
		<table css={tableStyles}>
			<thead>
				<tr>
					<th>Recipe</th>
					<th>Author(s)</th>
					<th>App-ready</th>
					<th>Actions</th>
				</tr>
			</thead>
			<tbody>
				{list.map(
					({ id, title, contributors, canonicalArticle, isAppReady }, i) => {
						return (
							<tr key={`row_${i}`}>
								<td key={`path_${i}_title`}>
									<a
										href={`https://theguardian.com/${canonicalArticle}`}
										target="_blank"
									>
										{title}{' '}
										<SvgExternal isAnnouncedByScreenReader size="xsmall" />
									</a>
								</td>
								<td key={`path_${i}_author`}> {contributors.join(', ')} </td>
								<td key={`path_${i}_app`}>
									{isAppReady ? (
										<span css={tickStyles}>
											<SvgTickRound isAnnouncedByScreenReader size="small" />
										</span>
									) : (
										<span css={crossStyles}>
											<SvgCrossRound isAnnouncedByScreenReader size="small" />
										</span>
									)}
								</td>
								<td key={`path_${i}_links`}>
									<a
										href={
											curationEndpoint +
											'/' +
											id +
											'?capiId=' +
											canonicalArticle
										}
									>
										Edit
									</a>
								</td>
							</tr>
						);
					},
				)}
			</tbody>
		</table>
	);
};

const tableStyles = css`
	width: 100%;
	border-collapse: collapse;
	border-spacing: 0;
	text-align: left;
	th,
	td {
		padding: 0.5rem;
		border-bottom: 1px solid #ccc;
	}
	th {
		font-weight: bold;
		background-color: #eee;
	}
`;

const tickStyles = css`
	svg {
		fill: ${palette.success[500]};
	}
`;

const crossStyles = css`
	svg {
		fill: ${palette.error[500]};
	}
`;

export default RecipeList;
