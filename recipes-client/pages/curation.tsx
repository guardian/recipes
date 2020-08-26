/** @jsx jsx */
import { Component } from "react";
import { jsx } from "@emotion/core";
import Recipe from "~components/recipe";

import demoRecipe from "~data/recipe"

import schema from "~data/recipe-schema"

interface CurationProps {
  topicId: string;
}

class Curation extends Component<CurationProps> {
  constructor(props: CurationProps){
    super(props);
    console.log(demoRecipe)
  }
  render() {
    // ["path", "recipe_title", ....]
    return (
      <div
        css={{
          display: "grid",
          gridTemplateColumns: "25% 25% 25% 25%",
          gridTemplateRows: "auto",
          gridTemplateAreas: `"header header header header" "left left right right" "footer footer footer footer"`,
        }}
      >
        <div css={{ gridArea: "header", background: "red" }}>header</div>
        <div css={{ gridArea: "left", background: "blue" }}>
          <Recipe url={"https://www.youtube.com/embed/" + this.props.topicId} />
        </div>
        <div css={{ gridArea: "right", background: "yellow" }}>
          <form>
            <input type="text" value={demoRecipe['path']} readOnly></input>
            <input type="text" value={demoRecipe['recipes_title']} readOnly></input>
            <input type="text" value={demoRecipe['serves']} readOnly></input>
            <input type="text" value={demoRecipe['credit']} readOnly></input>
            <input type="text" value={demoRecipe['occasion']} readOnly></input>
            <input type="text" value={demoRecipe['cuisines']} readOnly></input>
            <input type="text" value={demoRecipe['meal_type']} readOnly></input>
            <input type="text" value={demoRecipe['ingredient_tags']} readOnly></input>
            <textarea value={demoRecipe['time'].join("\n")} readOnly></textarea>
          </form>
        </div>
        <div css={{ gridArea: "footer", background: "green" }}>buttons</div>
      </div>
    );
  }
}
export default Curation;
