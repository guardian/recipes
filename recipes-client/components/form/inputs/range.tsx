/** @jsxImportSource @emotion/react */

import { ActionType, Range } from 'interfaces/main';
import { Dispatch } from 'react';
import FormItem from '../form-item';

export const renderRangeFormGroup = (
  formItems: Range,
  choices: string[] | null,
  key: string,
  dispatcher: Dispatch<ActionType>,
) => {
  const fields = Object.keys(formItems).map((k: keyof Range) => {
    return (
      <div
        css={{
          fontFamily: 'GuardianTextSans',
          fontSize: '0.9rem',
          color: "gray"
        }}
      >
        {k}
        <FormItem
          text={formItems[ k ]}
          choices={choices}
          label={`${key}.${k}`}
          key={`${key}.${k}`}
          dispatcher={dispatcher}
        />
      </div>

    );
  });
  return [ <div css={{display: "flex"}}>{fields}</div> ];
};
