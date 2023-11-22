/** @jsxImportSource @emotion/react */
import { Dispatch } from 'react';
import {
	ActionType,
	SchemaItem,
	AllRecipeFields,
	isSchemaType,
} from '../interfaces/main';
import { FormGroup } from './form/form-group';
import { isDisplayed, UIschema } from '../consts/index';
import { isUIschemaItem } from '../interfaces/ui';
import { orderComponents } from '../utils/ordering';

interface RecipeComponentProps {
	body: AllRecipeFields;
	schema: SchemaItem | null;
	isLoading: boolean;
	dispatcher: Dispatch<ActionType>;
}

const RecipeComponent = ({
	body,
	schema,
	isLoading,
	dispatcher,
}: RecipeComponentProps): JSX.Element | JSX.Element[] => {
	const UIOrder = isUIschemaItem(UIschema) ? UIschema['ui:order'] : null;

	if (isLoading) {
		return <h3> LOADING... </h3>;
	} else if (schema === null || schema.properties === undefined) {
		return <h3> No schema loaded... </h3>;
	} else if (body === undefined || body === null) {
		return <h3> No bodayyyyy</h3>;
	} else {
		const recipeComponents = UIOrder ? orderComponents(body, UIOrder) : body;
		return Object.keys(recipeComponents).reduce(
			(acc, key: keyof AllRecipeFields) => {
				if (isDisplayed(key) && isSchemaType(schema)) {
					return [
						...acc,
						<FormGroup
							formItems={body[key]}
							schema={schema.properties[key]}
							UIschema={UIschema[key]}
							key_={key}
							title={key}
							dispatcher={dispatcher}
							key={key}
						></FormGroup>,
					];
				} else {
					return [acc];
				}
			},
			[] as JSX.Element[],
		);
	}
};

export default RecipeComponent;
