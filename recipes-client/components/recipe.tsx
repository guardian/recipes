/** @jsxImportSource @emotion/react */
import { Component } from "react";

interface RecipeProps {
  url: string;
}

class Recipe extends Component<RecipeProps> {
  constructor(props: RecipeProps) {
    super(props);
  }
  render(): JSX.Element {
    const url = this.props.url;

    return (
      <iframe
        css={{ width: "100%", border: 0 }}
        src={url}
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    );
  }
}
export default Recipe;
