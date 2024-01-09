/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { SvgExternal } from '@guardian/source-react-components';
import { curationEndpoint } from '../../consts/index';
import { CheckedSymbol } from '../reusables/app-ready-status';

interface RecipeListProps {
	list: RecipeListType[];
}

export interface RecipeListType {
	composerId: string;
	id: string;
	title: string;
	contributors: string[];
	byline: string[];
	canonicalArticle: string;
	isAppReady: boolean;
	isInCuratedTable: boolean;
}

const RecipeList = ({ list }: RecipeListProps): JSX.Element => {
	const displayAuthor = (contributors: string[], byline: string[]) => {
		const prettifyContributorId = (contributorId: string) => {
			if (contributorId === 'profile/yotamottolenghi') {
				return 'Yotam Ottolenghi';
			}
			if (contributorId === 'profile/nigelslater') {
				return 'Nigel Slater';
			}
			return contributorId
				.split('/')
				.pop()
				.split('-')
				.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
				.join(' ');
		};
		contributors = contributors.map(prettifyContributorId);
		if (contributors.length > 0) {
			return contributors.map((c) => prettifyContributorId(c)).join(', ');
		} else if (byline.length > 0) {
			return byline.join(', ');
		} else {
			return '-';
		}
	};
	return (
		<table css={tableStyles}>
			<colgroup>
				<col style={{ width: '40%' }} />
				<col style={{ width: '20%' }} />
				<col style={{ width: '10%' }} />
				<col style={{ width: '10%' }} />
				<col style={{ width: '10%' }} />
				<col style={{ width: '10%' }} />
			</colgroup>
			<thead>
				<tr>
					<th>Recipe</th>
					<th>Author(s)</th>
					<th>Assignee</th>
					<th>Edited</th>
					<th>App-ready</th>
					<th>Actions</th>
				</tr>
			</thead>
			<tbody>
				{list.map(
					(
						{
							id,
							title,
							contributors,
							byline,
							canonicalArticle,
							isAppReady,
							isInCuratedTable,
							workflow,
						},
						i,
					) => {
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
								<td key={`path_${i}_author`}>
									{displayAuthor(contributors, byline)}{' '}
								</td>
								<td key={`path_${i}_assignee`}>{workflow?.assignee ?? '-'}</td>
								<td key={`path_${i}_edited`}>
									<CheckedSymbol isAppReady={isInCuratedTable} />
								</td>
								<td key={`path_${i}_app`}>
									<CheckedSymbol isAppReady={isAppReady} />
								</td>
								<td key={`path_${i}_links`}>
									<a href={curationEndpoint + '/' + id}>Edit</a>
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

export default RecipeList;
