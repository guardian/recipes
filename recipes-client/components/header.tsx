/** @jsx jsx */
import { Component } from "react";
import { jsx } from "@emotion/core";


interface HeaderProps {
  recipeUrl: string
  recipeNumber: number|null
  }

class Header extends Component<HeaderProps> {
    constructor(props: HeaderProps) {
      super(props);
    }
    render(): React.Component|JSX.Element{
        const {recipeUrl, recipeNumber} = this.props;
        return (
            <h4>Article: {recipeUrl} Recipe Number: {recipeNumber}</h4>
        )
    }
  }
  export default Header;