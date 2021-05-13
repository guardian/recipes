import { schemaItem } from "~interfaces/main"
import { UIschemaItem } from "~interfaces/ui"

/* Routing information */
export const apiURL = "/api/curation/"
export const capiProxy = "/api/capi/"
export const listEndpoint = "/api/list"
export const schemaEndpoint = "schema"
export const saveEndpoint = "submit"
export const curationEndpoint = "curation"

export const urls = {
  capiQuery: "capi",
  matches: "check"
}

/* UI display output config */
export const newColours = ["aquamarine", "blue", "brown", "coral", "yellow", "chartreuse", "darkseagreen"];
export const defaultHighlightColours   = ["#E69F0090", "#56B4E990", "#009E7390", "#FEDC2A", "#0072B290", "#D55E0090", "#CC79A790"]

export const excludeInForm = ["credit", "recipeId", "image", "path"];
export const excludeInHighlights = excludeInForm.concat(["ingredient_tag", "cuisines", "meal_type", "occasion"]);
export const bylineFields = ["credit"];

export const UIschema: UIschemaItem = {
	"ui:order": ["path", "recipeId", "recipes_title", "credit", "image", "serves", "time",
		"steps", "ingredients_lists",
		"occasion", "cuisines", "meal_type", "ingredient_tags", "diet_tags"
	],
	"path": {
		"ui:display": false,
		"ui:locked": true,
    "ui:removable": false
	},
	"recipeId": {
		"ui:display": false,
		"ui:locked": true,
    "ui:removable": false
	},
	"recipes_title": {
		"ui:display": true,
    "ui:locked": false,
		"ui:removable": false
	},
	"serves": {
		"ui:display": true,
    "ui:locked": false,
		"ui:removable": false
	},
	"image": {
		"ui:display": false,
    "ui:locked": false,
		"ui:removable": false
	},
	"time": {
		"ui:display": true,
    "ui:locked": false,
		"ui:removable": true
	},
	"steps": {
		"ui:display": true,
    "ui:locked": false,
		"ui:removable": true
	},
	"credit": {
		"ui:display": true,
    "ui:locked": false,
		"ui:removable": false
	},
	"ingredients_lists": {
		"ui:display": true,
    "ui:locked": false,
		"ui:removable": true,
		"ui:order": ["title", "ingredients"],
		"ingredients": {
			"ui:display": true,
			"ui:order": ["text", "item", "unit", "comment", "quantity"],
			"quantity": {
				"ui:display": true,
				"ui:order": ["absolute", "from", "to"]
			}
		},
		"title": {
			"ui:display": true,
		}
	},
	"occasion": {
		"ui:display": true,
    "ui:locked": false,
		"ui:removable": true
	},
	"cuisines": {
		"ui:display": true,
    "ui:locked": false,
		"ui:removable": true
	},
	"meal_type": {
		"ui:display": true,
    "ui:locked": false,
		"ui:removable": true
	},
	"ingredient_tags": {
		"ui:display": true,
    "ui:locked": false,
		"ui:removable": true
	},
	"diet_tags": {
		"ui:display": true,
    "ui:locked": false,
		"ui:removable": true
	}
};

// function isRemovable(key:string){

// }
// function isLocked(key:string){

// }
export function isDisplayed(key: keyof schemaItem|string): boolean {
  // const wObj: {[k: string]: unknown} = obj;
  const wUIschema: { [key: string]: {"ui:display": false} } = UIschema; // safely widen to wObj
  return wUIschema[key]["ui:display"]
}
export function isRemovable(key: keyof schemaItem|string): boolean {
	const wUIschema: { [key: string]: {"ui:removable": false} } = UIschema; // safely widen to wObj
  return wUIschema[key]["ui:removable"]
}

// const filtered = Object.keys(raw)
//   .filter(key => allowed.includes(key))
//   .reduce((obj, key) => {
//     obj[key] = raw[key];
//     return obj;
//   }, {});
