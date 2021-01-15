/** @jsx jsx */
import { jsx } from "@emotion/core";
import { HighlightHTML} from "~components/comment-highlighter";
import { GuCAPIProps} from '~components/interfaces'
import { getHighlights, DOMParse } from "~utils/html-parsing";

function onHighlightMount(id: string, top: number, elem: HTMLElement): void {
  console.debug(`${id} highlight mount.`)
};

function focusComment(id: string): void {
  console.log(`${id} focussed.`)
};

function GuCAPIFrame(props: GuCAPIProps): JSX.Element {
  const {isLoading, recipeItems} = props;
  if (isLoading || recipeItems === null){
    return <h3> LOADING... </h3>
  } else {
    const {html} = props;
    const doc = DOMParse(html['fields']['body'])
    const highlights = getHighlights(doc, recipeItems)
    return <HighlightHTML html={doc} highlights={highlights} focusedId="" onHighlightMount={onHighlightMount} focusComment={focusComment} />

  }
}

export default GuCAPIFrame;