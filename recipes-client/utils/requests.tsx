import { actions } from "~actions/recipeActions";
import { Dispatch } from "react";
import { ActionType, AddRemoveItemType, AppDataState, ErrorItemType } from "~interfaces/main";

export async function fetchAndDispatch(url: string, action: string, payloadType: string,
  dispatcher: Dispatch<ActionType>): Promise<void> {

  const payload: { [id: string]: AppDataState | AddRemoveItemType | ErrorItemType; } = {};
  return fetch(url).then((response) => {
    return response.json();
  }).then((data: Record<string, AppDataState | AddRemoveItemType> | ErrorItemType) => {
    payload[payloadType] = data;
    dispatcher({ "type": action, "payload": payload });
  }).catch(() => dispatcher({ "type": actions.error, "payload": `Error fetching ${payloadType} data.` }));
}
export function setLoadingFinished(dispatcher: Dispatch<ActionType>): void {
  dispatcher({ "type": actions.init, "payload": { 'isLoading': false } });
}
