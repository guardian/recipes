/** @jsxImportSource @emotion/react */
import { useState } from "react";
import RecipeList from "../components/recipe-list";
import { listEndpoint } from "../consts/index";

function Home(): JSX.Element {
  const [recipeList, setList] = useState(null);
  fetch(listEndpoint)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      setList(data);
    })
    .catch(() => {
      return null;
    });

  return (
    <div>
      <h1>Recipe Curator</h1>
      <h2>This is it how it works:</h2>
      <ul>
        <li>Pick a recipe.</li>
        <li> Edit it. </li>
        <li> Save it. </li>
      </ul>
      <h3>Why not try one of these?</h3>
      {recipeList !== null && <RecipeList list={recipeList} />}
    </div>
  );
}
export default Home;
