/** @jsxImportSource @emotion/react */
import { Component, Dispatch } from 'react';
import FormItem from './form-item';
import {
	ActionType,
	ingredientField,
	ingredientListFields,
	isingredientQuantityField,
	isingredientField,
	isingredientListFields,
	schemaItem,
	schemaType,
	ingredientQuantityField,
} from '../interfaces/main';
import { actions } from '../actions/recipeActions';
import { getSchemaType } from '../utils/schema';
import { UIItem, UIschemaItem } from '../interfaces/ui';
import { isRemovable } from '../consts';
import { orderComponents } from '../utils/ordering';
import FormButton from './reusables/FormButton';
import { Legend } from '@guardian/source-react-components';

const isStringOrNumber = (
	item:
		| string
		| Array<string | Record<string, unknown>>
		| Record<string, unknown>,
) => {
	return typeof item === 'string' || typeof item === 'number';
};

export const formatTitle = (text: string | null) => {
	// Reformat title with first letter uppercase
	if (text === null) {
		return null;
	} else {
		const title = text.replace('_', ' ');
		return title[0].toUpperCase() + title.slice(1);
	}
};

const getLabel = (lab: string): string => {
	// Utility to get text label removing any numbers
	return lab
		.split('.')
		.reverse()
		.reduce((acc, l) => {
			if (acc.length > 0) {
				return acc;
			} else {
				return isFinite(l) ? acc : l;
			}
		}, '');
};

const handleAddField = (
	objId: string,
	schemaItem: schemaItem,
	dispatcher: Dispatch<ActionType>,
): void => {
	dispatcher({
		type: actions.add,
		payload: { objId: objId },
		schemaItem: schemaItem,
	});
};

const handleRemoveField = (
	objId: string,
	dispatcher: Dispatch<ActionType>,
): void => {
	dispatcher({
		type: actions.delete,
		payload: { objId: objId },
	});
};

export const getItemButtons = (
	key: string,
	formItemAddId: string,
	formItemRemoveLastId: string,
	formFieldsSchema: schemaItem,
	dispatcher: Dispatch<ActionType> | null,
): JSX.Element => {
	return (
		<div css={{ marginTop: '5px' }}>
			<FormButton
				text={`+ ${key.split('.').slice(-1)[0]}`}
				buttonId={`${key}.add`}
				onClick={() =>
					handleAddField(formItemAddId, formFieldsSchema, dispatcher)
				}
			/>
			<FormButton
				text={`- ${key.split('.').slice(-1)[0]}`}
				buttonId={`${key}.add`}
				onClick={() => handleRemoveField(formItemRemoveLastId, dispatcher)}
			/>
		</div>
	);
};

interface FormGroupProps {
	formItems:
		| string
		| Array<string | Record<string, unknown>>
		| Record<string, unknown>;
	schema: schemaItem;
	UIschema: UIItem;
	title: string;
	key_?: string | null;
	dispatcher?: Dispatch<ActionType> | null;
}

const getFormFields = (
	formItems:
		| string
		| Array<string | Record<string, unknown>>
		| Record<string, unknown>
		| ingredientListFields,
	schema: schemaItem,
	UIschema: UIschemaItem,
	key: string,
	dispatcher: Dispatch<ActionType>,
): JSX.Element[] => {
	// Get form components for each item in `formItems`
	// console.log('Schema: ' + JSON.stringify(schema));
	const choices = schema.enum || null;
	// Recursively parse all elements in JSON tree
	if (getSchemaType(schema.type).includes('null') && formItems === null) {
		return [] as JSX.Element[];
	} else if (key === 'serves') {
		return [
			<FormItem
				text={formItems}
				choices={choices}
				label={key}
				key={`${key}.formItem`}
				dispatcher={dispatcher}
			>
				{' '}
			</FormItem>,
		];
	} else if (
		getSchemaType(schema.type).includes('string') &&
		isStringOrNumber(formItems)
	) {
		// String -> single form field
		return [
			<FormItem
				text={formItems}
				choices={choices}
				label={key}
				key={`${key}.formItem`}
				dispatcher={dispatcher}
			>
				{' '}
			</FormItem>,
		];
	} else if (
		getSchemaType(schema.type).includes('array') &&
		Array.isArray(formItems)
	) {
		// Array -> process each element recursively
		return formItems.map((item: schemaItem, i: int) => {
			const rComponents = UIschema['ui:order']
				? orderComponents(item, UIschema['ui:order'])
				: item;
			return getFormFields(
				rComponents,
				schema.items,
				UIschema,
				key + '.' + String(i),
				dispatcher,
			);
		});
	} else if (
		isingredientListFields(formItems) &&
		getSchemaType(schema.type).includes('object')
	) {
		// ingredient list object
		const rComponents = UIschema['ui:order']
			? orderComponents(formItems, UIschema['ui:order'])
			: formItems;
		return Object.keys(rComponents).map((cKey) => {
			return cKey === 'title' ? (
				<FormItem
					text={rComponents[cKey]}
					choices={choices}
					label={cKey}
					key={`${cKey}.formItem`}
					dispatcher={dispatcher}
				/>
			) : (
				getFormFields(
					rComponents[cKey],
					schema.properties[cKey],
					UIschema[cKey],
					`${key}.${cKey}`,
					dispatcher,
				)
			);
		});
	} else if (isingredientQuantityField(formItems)) {
		// ingredient quantity object
		return Object.keys(formItems).map((k: keyof ingredientQuantityField) => {
			return (
				<FormItem
					text={formItems[k]}
					choices={choices}
					label={`Quantity:${k}`}
					key={`${key}.${k}`}
					dispatcher={dispatcher}
				>
					{' '}
				</FormItem>
			);
		});
	} else if (isingredientField(formItems)) {
		// ingredient field object
		// return renderIngredientField(formItems, schema, key, dispatcher);
		const formItemAddId = `${key}`;
		const formItemRemoveLastId = `${key}`;
		const fields = Object.keys(formItems).map((k: keyof ingredientField) => {
			if (k === 'quantity') {
				return getFormFields(
					formItems.quantity,
					schema.properties.quantity,
					UIschema.quantity,
					`${key}.quantity`,
					dispatcher,
				);
			} else {
				return (
					<FormItem
						text={formItems[k]}
						choices={choices}
						label={k}
						key={`${key}.${k}`}
						dispatcher={dispatcher}
					>
						{' '}
					</FormItem>
				);
			}
		});
		return [
			<fieldset key={`${key}.fieldset`} css={{}}>
				<Legend key={`${key}.legend`} text={key}></Legend>
				{fields}
				{getItemButtons(
					key,
					formItemAddId,
					formItemRemoveLastId,
					schema,
					dispatcher,
				)}
			</fieldset>,
		];
	} else {
		console.warn(`Cannot get item '${key}' in formItems, leaving field empty.`);
		return [] as JSX.Element[];
	}
};

function renderIngredientField(
	formItems: ingredientField,
	schema: schemaType,
	UIschema: UIschemaItem,
	key: string,
	dispatcher: Dispatch<ActionType>,
): JSX.Element[] {
	const formItemAddId = `${key}`;
	const formItemRemoveLastId = `${key}`;
	const fields = Object.keys(formItems).map((k: keyof ingredientField) => {
		if (k === 'quantity') {
			return getFormFields(
				formItems.quantity,
				schema.properties.quantity,
				UIschema.quantity,
				`${key}.quantity`,
				dispatcher,
			);
		} else {
			return (
				<FormItem
					text={formItems[k]}
					choices={null}
					label={k}
					key={`${key}.${k}`}
					dispatcher={dispatcher}
				>
					{' '}
				</FormItem>
			);
		}
	});
	return [
		<fieldset key={`${key}.fieldset`} css={{}}>
			<Legend key={`${key}.legend`} text={key}></Legend>
			{fields}
			{getItemButtons(
				key,
				formItemAddId,
				formItemRemoveLastId,
				schema,
				dispatcher,
			)}
		</fieldset>,
	];
}

function getFormFieldsSchema(
	formItems:
		| string
		| Array<string | Record<string, unknown>>
		| Record<string, unknown>,
	schema: schemaItem,
): schemaItem {
	// Get schema for contents of given formItem
	if (getSchemaType(schema.type).includes('string')) {
		return { type: 'string' } as schemaItem;
	} else if (getSchemaType(schema.type).includes('array')) {
		return schema.items;
	} else if (getSchemaType(schema.type).includes('object')) {
		return schema.properties;
	} else {
		return schema; //{"type": "null"} as schemaItem
	}
}

export class FormGroup extends Component<FormGroupProps> {
	constructor(props: FormGroupProps) {
		super(props);
	}

	render(): React.Component | JSX.Element {
		const { formItems, schema, title, UIschema } = this.props;
		// const  choices = schema.enum || null;
		const key = this.props.key_ || title;
		const dispatcher = this.props.dispatcher || null;

		// Set up form group
		const rComponents =
			UIschema['ui:order'] && !Array.isArray(formItems)
				? orderComponents(formItems, UIschema['ui:order'])
				: formItems;
		const formFields = getFormFields(
			rComponents,
			schema,
			UIschema,
			key,
			dispatcher,
		);
		const isFormItemRemovable = isRemovable(getLabel(key));

		// Set up buttons under form group
		const formFieldsSchema = getFormFieldsSchema(rComponents, schema);
		const formItemAddId = `${key}.${formFields.length}`;
		const formItemRemoveLastId = `${key}.${formFields.length - 1}`;
		const formItemButtons = getItemButtons(
			key,
			formItemAddId,
			formItemRemoveLastId,
			formFieldsSchema,
			dispatcher,
		);

		const formFieldStyle = {
			minWidth: '500px',
			gridArea: 'field',
			display: 'grid',
			width: 'max-content',
		};

		return (
			<fieldset key={`${key}.fieldset`} css={{}}>
				<Legend key={`${key}.legend`} text={key}></Legend>
				{formFields}
				{isFormItemRemovable && formItemButtons}
			</fieldset>
		);
	}
}
