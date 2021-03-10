/** @jsx jsx */

export interface schemaItem {
    type: string;
    items?: Array<Record<string, unknown>>;
    properties?: Record<string, unknown>|ingredientListFields;
    enum?: Array<string>;
  }

export interface schemaType {
    "properties": {
      [key in keyof allRecipeFields]: allRecipeFields[key];
    }
}

interface allRecipeFields extends recipeMetaFields, recipeFields {};

export interface recipeMetaFields {
  "path": schemaItem;
  "occasion": schemaItem;
  "cuisines": schemaItem;
}

export interface recipeFields {
  "recipes_title": recipeItem;
  "serves": recipeItem;
  "time": recipeItem;
  "steps": recipeItem;
  "credit": recipeItem;
  "ingredients_lists": recipeItem;
}

export type recipeItem = null
                      | string 
                      | string[] 
                      | ingredientListFields[]
                      | ingredientField 
                      | ingredientField[] 
                      | timeField 
                      | timeField[];

export type ingredientListFields = {
  "title": string | null;
  "ingredients": Array<ingredientField>;
}

export type ingredientField = {
  "text" : string;
  "item" : string; 
  "unit" : string; 
  "comment" : string;
  "quantity" : string;
}

export type timeField = {
  "instruction" : string; 
  "quantity" : string; 
  "unit" : string;
  "text" : string;
}

export interface ActionType {
  payload: AppDataState|AddRemoveItemType|ErrorItemType;
  type: string;
}


export type ErrorItemType = string;

export interface GuCAPIProps {
  articlePath: string;
  isLoading: boolean;
  html: Record<string, Record<string, unknown>>;
  recipeItems: recipeFields| null; //|Record<string, unknown>|null;
  colours?: string[] | null;
}


export function isCurationState(payload: keyof typeof ActionType.payload): payload is CurationState {
  const cs = (payload as CurationState);
  if (cs.body || cs.schema || cs.html){
    return true
  }
  return false
}

export function isLoadingState(payload: keyof typeof ActionType.payload): payload is LoadingState {
  const ls = (payload as LoadingState);
  if (ls.isLoading !== undefined){
    return true
  }
  return false
}

export function isAddRemoveItemType(payload: keyof typeof ActionType.payload): payload is AddRemoveItemType {
  const p = (payload as AddRemoveItemType);
  if (p.objId !== undefined){
    return true
  }
  return false
}

export interface AddRemoveItemType {
  objId: string;
}

export type AppDataState = CurationState & LoadingState

export interface LoadingState {
  readonly isLoading: boolean;
}

export interface CurationState {
  readonly body: allRecipeFields|Record<string, unknown>|null; 
  readonly schema: Record<string, unknown>|null;
  readonly html: Record<string, unknown>|null;
  readonly colours?: string[] | null;
}

export type HighlightType = keyof typeof recipeFields; // 'search_result' | 'comment'; //[key in keyof schemaType['properties']] 'search_result' | 'comment';

export type Highlight = {
  id: string,
  type: HighlightType,
  range: ResourceRange
}

export type ResourceRange = {
  elementNumber: number,
  startCharacter: number,
  endCharacter: number
}