/** @jsx jsx */
import { jsx } from "@emotion/core";
import parse from 'html-react-parser';

export default (props: { articlePath: string, isLoading: boolean, html: Record<string, Record<string, unknown>> }): JSX.Element => {
  const {isLoading} = props;
  if (isLoading){
    return <h3> LOADING... </h3>
  } else {
    const {html} = props;
    return parse(html['fields']['body'])
  }
};
