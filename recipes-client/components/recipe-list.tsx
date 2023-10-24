/** @jsxImportSource @emotion/react */
import { curationEndpoint } from '../consts/index';

interface RecipeListProps {
	list: RecipeListType[];
}

interface RecipeListType {
	path: string;
	title: string | null;
	recipeId: number;
}

const RecipeList = ({ list }: RecipeListProps): JSX.Element => {
	return (
		<table>
			<thead>
				<tr>
					<th>Title</th>
					<th>Actions</th>
				</tr>
			</thead>
			<tbody>
				{list.map(({ path, title, recipeId }, i) => {
					return (
						<tr key={`row_${i}`}>
							<td key={`path_${i}_title`}> {title} </td>
							<td key={`path_${i}_links`}>
								<a href={curationEndpoint + path + `_${recipeId}`}>Edit</a>
							</td>
						</tr>
					);
				})}
			</tbody>
		</table>
	);
};

export default RecipeList;
