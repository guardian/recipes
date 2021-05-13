/** @jsx jsx */
import { Component } from "react";
import { jsx, css } from "@emotion/core";
import { body } from '@guardian/src-foundations/typography';

const headingStyles = css`
  display: inline-flex;
  align-items: flex-start;
  ${body.medium()};
  margin: 0;
`;

const articleInfoStyles = css`
  /* display: block; */
`;

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
            <h4 css={headingStyles}>
              Article URL:&nbsp; {recipeUrl}<br />

              {/* <input type="text" id="articlePath" name="Article Path" value={recipeUrl} readOnly></input> */}
              {/* Recipe Number: <input type="text" id="recipeId" name="Recipe Id" value={recipeNumber} readOnly></input> */}
              Recipe Number:&nbsp;{recipeNumber}
            </h4>
        )
    }
  }
  export default Header;
