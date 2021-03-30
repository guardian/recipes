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
        const {recipeUrl} = this.props;
        const recipeNumber =  this.props.recipeNumber === null ? '' : this.props.recipeNumber.toString()
        return (
            <h4 css={{display: "inline-flex", alignItems: "flex-start"}}>Article: <span css={{ 
                display: "block",
                overflow: "hidden",
                resize: "both",
                minHeight: "40px",
                lineHeight: "20px",
                border: "1px solid #ccc",
                fontFamily: "inherit",
                fontSize: "inherit",
                padding: "1px 6px",
                backgroundColor: "linen"
              }} className="input" role="textbox" > {recipeUrl} </span>

              {/* <input type="text" id="articlePath" name="Article Path" value={recipeUrl} readOnly></input> */}
              {/* Recipe Number: <input type="text" id="recipeId" name="Recipe Id" value={recipeNumber} readOnly></input> */}
              Recipe Number: <span css={{ 
                display: "block",
                overflow: "hidden",
                resize: "both",
                minHeight: "40px",
                lineHeight: "20px",
                border: "1px solid #ccc",
                fontFamily: "inherit",
                fontSize: "inherit",
                padding: "1px 6px",
                backgroundColor: "linen"
              }} className="input" role="textbox" > {recipeNumber} </span>
            </h4>
        )
    }
  }
  export default Header;