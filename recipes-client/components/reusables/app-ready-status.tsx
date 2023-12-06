/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { palette } from '@guardian/source-foundations';
import { SvgCrossRound, SvgTickRound } from '@guardian/source-react-components';

export const CheckedSymbol = ({ isAppReady }: { isAppReady: boolean }) => {
	{
		return isAppReady ? (
			<span css={tickStyles}>
				<SvgTickRound isAnnouncedByScreenReader size="medium" />
			</span>
		) : (
			<span css={crossStyles}>
				<SvgCrossRound isAnnouncedByScreenReader size="medium" />
			</span>
		);
	}
};

const tickStyles = css`
	svg {
		fill: ${palette.success[500]};
	}
`;

const crossStyles = css`
	svg {
		fill: ${palette.error[500]};
	}
`;
