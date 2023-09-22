/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { body } from "@guardian/source-foundations";

const headingStyles = css`
  display: inline-flex;
  align-items: flex-start;
  ${body.medium()};
  margin: 0;
`;

interface HeaderProps {
  recipeUrl: string;
  recipeNumber: number | null;
}

const Header = ({ recipeUrl, recipeNumber }: HeaderProps): JSX.Element => {
  const recipeNumberString =
    recipeNumber === null ? "" : recipeNumber.toString();
  return (
    <header>
      <h2>Recipe Curator</h2>
      <h4 css={headingStyles}>Article URL: {recipeUrl}</h4>
      <h4>Recipe Number: {recipeNumberString}</h4>
    </header>
  );
};

export default Header;
