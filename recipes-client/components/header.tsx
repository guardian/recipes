/** @jsx jsx */
import { Component } from "react";
import { jsx } from "@emotion/core";


interface HeaderProps {
  recipeUrl: string
  }

class Header extends Component<HeaderProps> {
    constructor(props: HeaderProps) {
      super(props);
    }
    render(): React.Component|JSX.Element{
        return (
            <h4>Current recipe: {this.props.recipeUrl} </h4>
        )
    }
  }
  export default Header;