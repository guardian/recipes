/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { headline, palette } from "@guardian/source-foundations";

const Header = (): JSX.Element =>
  <header css={css`
      ${headline.small()};
      text-align: center;
      padding: 0.5rem;
      background-color: ${palette.brand[400]};
      a {
        text-decoration: none;
        color: ${palette.neutral[100]};
      }
    `}>
    <a href="/"><h2>Recipe Curator</h2></a>
  </header>

export default Header;
