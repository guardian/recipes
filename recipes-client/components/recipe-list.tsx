/** @jsxImportSource @emotion/react */
import { curationEndpoint } from '../consts/index';

interface RecipeListProps {
	list: RecipeListType[];
}

interface RecipeListType {
	id: string;
	title: string;
	contributors: string[];
	canonicalArticle: string;
}

const RecipeList = ({ list }: RecipeListProps): JSX.Element => {
	return (
		<table>
			<thead>
				<tr>
					<th>Title</th>
					<th>Author(s)</th>
					<th>Actions</th>
				</tr>
			</thead>
			<tbody>
				{list.map(({ id, title, contributors, canonicalArticle }, i) => {
					return (
						<tr key={`row_${i}`}>
							<td key={`path_${i}_title`}>
								<a
									href={`https://theguardian.com/${canonicalArticle}`}
									target="_blank"
								>
									{title}
								</a>
							</td>
							<td key={`path_${i}_author`}> {contributors.join(', ')} </td>
							<td key={`path_${i}_links`}>
								<a
									href={
										curationEndpoint + '/' + id + '?capiId=' + canonicalArticle
									}
								>
									Edit
								</a>
							</td>
						</tr>
					);
				})}
			</tbody>
		</table>
	);
};

export default RecipeList;
