/** @jsx jsx */

export interface schemaItem {
    type: string;
    items?: Array<Record<string, unknown>>;
    properties?: Record<string, unknown>;
    enum?: Array<string>;
  }

export interface schemaType {
    "properties": {
    "path": schemaItem;
    "recipes_title": schemaItem;
    "serves": schemaItem;
    "time": schemaItem;
    "steps": schemaItem;
    "credit": schemaItem;
    "ingredients_lists": schemaItem;
    "occasion": schemaItem;
    "cuisines": schemaItem;
    }
}

export interface ActionType {
  payload: CurationState|AddRemoveItemType;
  type: string;
}

export interface AddRemoveItemType {
  objId: string;
}

export function isCurationState(payload: CurationState | AddRemoveItemType): payload is CurationState {
  if((payload as CurationState).isLoading){
    return true
  }
  return false
}

export interface CurationState {
  readonly isLoading: boolean;
  readonly body: Record<string, unknown>|null; 
  readonly schema: Record<string, unknown>|null;
}