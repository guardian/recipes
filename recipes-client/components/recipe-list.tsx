/** @jsx jsx */
import { Component } from "react";
import { jsx } from "@emotion/core";
import { curationEndpoint } from "~consts/index";

interface RecipeListProps {
  list: RecipeListType[];
}

interface RecipeListType {
  path: string
  recipes_title: string | null
  recipeId: number
}

// interface AggregatedRecipeNumbers {
//   [key: string]: number[]}
// }

function formatRecipeNumberLink(recipeNumbers: number[], path: string) {
  return recipeNumbers.map((num, i) => {
    return <a key={`${num}_${i}`} href={curationEndpoint + path + `_${num}`}> {num} </a>
  })
}

class RecipeList extends Component<RecipeListProps> {
  constructor(props: RecipeListProps) {
    super(props);
  }
  render(): JSX.Element {

    const rows = this.props.list.reduce((acc, item) => {
      const { path, recipeId } = item;
      return { ...acc, [path]: [...(acc[path] || []), recipeId] };
    }, {} as { [key: string]: number[] });

    return (
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Recipes number</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(rows).map((arr, i) => {
            return (
              <tr key={`row_${i}`}>
                <td key={`path_${i}_title`}> {arr[0]} </td>
                <td key={`path_${i}_links`}> {formatRecipeNumberLink(arr[1], arr[0])} </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    );
  }
}
export default RecipeList;
