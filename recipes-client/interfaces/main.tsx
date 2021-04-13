/** @jsx jsx */

export interface schemaItem {
    type: string|string[];
    items?: schemaItem;
    properties?: allRecipeFields|ingredientListFields;
    enum?: Array<string>;
  }

export interface schemaArrayItem {
    type: string|string[];
    items: Array<Record<string, unknown>>;
  }

export function isSchemaArray(obj: schemaItem): obj is schemaArrayItem {
  return Object.keys(obj).includes("items");
} 

export interface schemaType {
    "properties": {
      [key in keyof allRecipeFields]: allRecipeFields[key];
    }
}

export function isingredientListFields(obj: schemaType|allRecipeFields|ingredientListFields): obj is ingredientListFields {
  if (obj.properties !== undefined){
    return Object.keys(obj.properties).includes("ingredients")
  } else {
    return Object.keys(obj).includes("ingredients")
  }
}

export interface allRecipeFields extends recipeMetaFields, recipeFields {};

export interface recipeMetaFields {
  "path": string;
  "recipeId": string;
  "occasion": string[]|null;
  "cuisines": string[]|null;
}

export interface recipeFields {
  "recipes_title": string|null;
  "serves": string|null;
  "time": timeField[]|null;
  "steps": string[]|null;
  "credit": string[]|string|null;
  "ingredients_lists": ingredientListFields[];
  "image": string|null;
}

export type recipeItem = null
                      | string 
                      | string[] 
                      | ingredientListFields[]
                      | timeField[]
                      | ingredientField[];

export type ingredientListFields = {
  "title": string | null;
  "ingredients": ingredientField[];
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
  schema: schemaType;
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

export type HighlightType = string; //keyof recipeFields;

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