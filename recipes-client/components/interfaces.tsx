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
  payload: CurationState;
  type: string;
}

export interface CurationState {
  readonly isLoading: boolean;
  readonly body: Record<string, unknown>|null; 
  readonly schema: Record<string, unknown>|null;
}