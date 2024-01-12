/** @jsxImportSource @emotion/react */
import { ChangeEvent, Dispatch, useEffect, useState } from 'react';
import FormItem from './form-item';
import {
	ActionType,
	IngredientsGroup,
	Instruction,
	ModifiedInstruction,
	SchemaItem,
} from '../../interfaces/main';
import { getSchemaType } from '../../utils/schema';
import { UIItem, UIschemaItem } from '../../interfaces/ui';
import { isRemovable } from '../../consts';
import { orderComponents } from '../../utils/ordering';
import { Legend } from '@guardian/source-react-components';
import {
	isIngredientsField,
	isInstructionsField,
	isServesField,
	isTimingsField,
} from 'utils/recipe-field-checkers';
import { renderTimingsFormGroup } from './inputs/timings';
import { renderIngredientsFormGroup } from './inputs/ingredients';
import { renderInstructionsFormGroup } from './inputs/instructions';
import { renderServesFormGroup } from './inputs/serves';
import { getItemButtons } from './form-buttons';
import { handleMergeFields } from './form-input-handlers';

const isStringNumberOrBoolean = (
	item:
		| string
		| Array<string | Record<string, unknown>>
		| Record<string, unknown>,
) => {
	return (
		typeof item === 'string' ||
		typeof item === 'number' ||
		typeof item === 'boolean'
	);
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

type FormItems =
	| string
	| Array<string | Record<string, unknown>>
	| Record<string, unknown>
	| IngredientsGroup;

interface FormGroupProps {
	formItems: FormItems;
	schema: SchemaItem;
	UIschema: UIItem;
	title: string;
	key_?: string | null;
	dispatcher?: Dispatch<ActionType> | null;
}

const getFormFields = (
	formItems: FormItems,
	schema: SchemaItem,
	UIschema: UIschemaItem,
	key: string,
	dispatcher: Dispatch<ActionType>,
	toggleInstructionsToMerge: (
		event: ChangeEvent<HTMLInputElement>,
		key: Instruction[],
	) => void,
	checkedFields: Record<string, boolean>,
	setCheckedFields: (value: React.SetStateAction<{}>) => void,
): JSX.Element[] => {
	// Get form components for each item in `formItems`
	const choices = schema.enum || null;
	// Recursively parse all elements in JSON tree
	if (getSchemaType(schema.type).includes('null') && formItems === null) {
		return [] as JSX.Element[];
	} else if (
		getSchemaType(schema.type).includes('string') &&
		isStringNumberOrBoolean(formItems)
	) {
		// String -> single form field
		return [
			<FormItem
				text={formItems}
				choices={choices}
				label={key}
				key={`${key}.formItem`}
				dispatcher={dispatcher}
			/>,
		];
	} else if (getSchemaType(schema.type).includes('boolean')) {
		return [
			<FormItem
				text={formItems}
				choices={choices}
				label={key}
				key={`${key}.formItem`}
				dispatcher={dispatcher}
			/>,
		];
	} else if (
		getSchemaType(schema.type).includes('array') &&
		Array.isArray(formItems)
	) {
		// Array -> process each element recursively
		return formItems.map((item: SchemaItem, i: int) => {
			const rComponents = UIschema['ui:order']
				? orderComponents(item, UIschema['ui:order'])
				: item;
			return getFormFields(
				rComponents,
				schema.items,
				UIschema,
				`${key}.${i}`,
				dispatcher,
				toggleInstructionsToMerge,
				checkedFields,
				setCheckedFields,
			);
		});
	} else if (isTimingsField(formItems)) {
		return renderTimingsFormGroup(formItems, schema, choices, key, dispatcher);
	} else if (isIngredientsField(formItems)) {
		return renderIngredientsFormGroup(
			formItems,
			schema,
			choices,
			key,
			dispatcher,
		);
	} else if (isInstructionsField(formItems)) {
		return renderInstructionsFormGroup(
			formItems,
			schema,
			choices,
			key,
			dispatcher,
			toggleInstructionsToMerge,
			checkedFields,
			setCheckedFields,
		);
	} else if (isServesField(formItems)) {
		return renderServesFormGroup(formItems, schema, choices, key, dispatcher);
	} else {
		console.warn(`Cannot get item '${key}' in formItems, leaving field empty.`);
		console.log(`Form items: ${JSON.stringify(formItems)}`);
		return [] as JSX.Element[];
	}
};

export const getFormFieldsSchema = (schema: SchemaItem): SchemaItem => {
	// Get schema for contents of given formItem
	if (getSchemaType(schema.type).includes('string')) {
		return { type: 'string' } as SchemaItem;
	} else if (getSchemaType(schema.type).includes('array')) {
		return schema.items;
	} else if (getSchemaType(schema.type).includes('object')) {
		return schema.properties;
	} else {
		return schema; //{"type": "null"} as schemaItem
	}
};

export const FormGroup = ({
	formItems,
	schema,
	UIschema,
	title,
	key_,
	dispatcher,
}: FormGroupProps): JSX.Element => {
	// const  choices = schema.enum || null;
	const key = key_ || title;
	const formDispatcher = dispatcher || null;

	const [instructionsToMerge, setInstructionsToMerge] = useState<ModifiedInstruction[]>([]);
	const [checkedFields, setCheckedFields] = useState({});

	const toggleInstructionsToMerge = (
		e: ChangeEvent<HTMLInputElement>,
		newStep: Instruction,
		key: string,
	) => {
		const modifiedInstruction: ModifiedInstruction = {
			...newStep,
			objId: key,
		};
		if (e?.target.checked) {
			setInstructionsToMerge((instructions) => [...instructions, modifiedInstruction]);
		} else {
			setInstructionsToMerge((instructions) =>
				instructions.filter((instruction) => instruction.objId !== modifiedInstruction.objId),
			);
		}
	};


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
		toggleInstructionsToMerge,
		checkedFields,
		setCheckedFields,
	);
	const isFormItemRemovable = isRemovable(getLabel(key));

	// Set up buttons under form group
	const formFieldsSchema = getFormFieldsSchema(schema);
	const formItemAddId = `${key}.${formFields.length}`;
	const formItemRemoveId = `${key}.${formFields.length - 1}`;
	const formItemButtons = getItemButtons(
		key,
		formItemAddId,
		formItemRemoveId,
		formFieldsSchema,
		formDispatcher,
	);

	const mergeInstructions = () => {
		const sortedInstructions = instructionsToMerge.sort(
			(a, b) => a.stepNumber - b.stepNumber,
		);
		const combinedDescription = sortedInstructions
			.map((s) => s.description)
			.join('. ');
		handleMergeFields(
			sortedInstructions[0]?.objId!,
			combinedDescription,
			sortedInstructions,
			dispatcher!,
		);

		setInstructionsToMerge([]);

    // De-select checkboxes previously selected after the merge
		const resetCheckedFields = { ...checkedFields };
		Object.keys(resetCheckedFields).forEach((key) => {
			resetCheckedFields[key] = false;
		});
		setCheckedFields(resetCheckedFields);
	};

	return (
		<div css={{ overflow: 'scroll' }}>
			<Legend key={`${key}.legend`} text={key} css={{ width: '150px' }} />
			{key.includes('instructions') && (
				<button
					type="button"
					onClick={() => mergeInstructions()}
					disabled={instructionsToMerge.length < 2}
          style={{fontSize: '0.9375rem',
            fontWeight: instructionsToMerge.length >= 2 ? '800' : '400',
            fontFamily: 'GuardianTextSans,Guardian Text Sans Web,Helvetica Neue,Helvetica,Arial,Lucida Grande,sans-serif',
            color: instructionsToMerge.length >= 2 ? '#fff' : 'gray',
            width: '150px',
            background: instructionsToMerge.length >= 2 ? '#052962' : 'transparent', // Change background based on condition
            padding: '8px',
            cursor: instructionsToMerge.length >= 2 ? 'pointer' : 'default'
          }}
				>
					Merge instructions
				</button>
			)}
			<div css={{ display: 'grid' }}>{formFields}</div>
			<div>{isFormItemRemovable && formItemButtons}</div>
			<hr />
		</div>
	);
};
