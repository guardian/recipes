/** @jsx jsx */
import { Dispatch } from "react";
import { jsx } from "@emotion/core";
import { ActionType, schemaType } from "./interfaces";
import { apiURL } from "~consts";
import { actions } from "~actions/recipeActions";


interface FooterProps {
    articleId: string|null
    body: schemaType|null
    dispatcher: Dispatch<ActionType>
  }

async function postRecipe(aId: string|null, data: schemaType|null): Promise<Record<string, unknown>>{
// async function postRecipe(aId: string|null, data: Record<string, unknown>|null): Promise<Record<string, unknown>>{
    if (aId === null) {
        console.warn("No url provided!")
        return {"error": "No url provided."}
    } else if (data === null) {
        console.warn("No data provided!")
        return {"error": "No data provided."}
    }
    const articleUrl = aId.replace(/^\/+/, '');
    const response = await fetch(`${location.origin}${apiURL}${articleUrl}`, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return {"status": response.status}; //.json(); // parses JSON response into native JavaScript objects
  }

function resetRecipe(aId: string|null, dispatcher: Dispatch<ActionType>): void {
    if (aId === null) {
        console.warn("No url provided!")
        dispatcher({"type": actions.error, "payload": "[Reset] Error: No article id provided."});
    } else {
        const articleUrl = aId.replace(/^\/+/, '');
        fetch(`${location.origin}${apiURL}${articleUrl}`)
        .then((response) => {return response.json<{ data: Record<string,unknown>}>()})
        .then((data: Record<string,unknown>) => dispatcher({"type": actions.init, "payload": {isLoading: false, body: data}}))
        .catch(() => dispatcher({"type": actions.error, "payload": "Error fetching body data."}) );
    }
}

function Footer(props: FooterProps): JSX.Element|JSX.Element[]{
    const {articleId, body, dispatcher} = props;

    function submit(event: React.MouseEvent<HTMLInputElement>): void{
        event.preventDefault();
        postRecipe(articleId, body).catch((err) => console.error(err) );
    }

    function reset(event: React.MouseEvent<HTMLInputElement>): void {
        event.preventDefault();
        resetRecipe(articleId, dispatcher);
    }

    return (
        <form >
            <button onClick={submit}>Save</button>
            <button onClick={reset}>Reset</button>
        </form>
    )
  }
  export default Footer;