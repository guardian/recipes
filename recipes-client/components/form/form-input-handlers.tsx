import { ActionType, ModifiedInstruction, SchemaItem } from 'interfaces/main';
import { Dispatch } from 'react';
import { actions } from '../../actions/recipeActions';

// Additions
export const handleAddField = (
	objId: string,
	schemaItem: SchemaItem,
	dispatcher: Dispatch<ActionType>,
): void => {
	dispatcher({
		type: actions.add,
		payload: { objId: objId },
		schemaItem: schemaItem,
	});
};

// Removals
export const handleRemoveField = (
	objId: string,
	dispatcher: Dispatch<ActionType>,
): void => {
	dispatcher({
		type: actions.delete,
		payload: { objId: objId },
	});
};

// Changes
export const handleChangeText = (
	event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	dispatcher: Dispatch<ActionType>,
): void => {
	const objId = event.target.id;
	const objVal = event.target.value;
	dispatcher({
		type: actions.change,
		payload: { [objId]: objVal },
	});
};

export const handleChangeNumber = (
	event: React.ChangeEvent<HTMLInputElement>,
	dispatcher: Dispatch<ActionType>,
): void => {
	const objId = event.target.id;
	const objVal = Number(event.target.value);
	dispatcher({
		type: actions.change,
		payload: { [objId]: objVal },
	});
};

export const handleChangeBoolean = (
	event: React.ChangeEvent<HTMLInputElement>,
	dispatcher: Dispatch<ActionType>,
): void => {
	const objId = event.target.id;
	const objVal = event.target.checked;
	dispatcher({
		type: actions.change,
		payload: { [objId]: objVal },
	});
};

export const handleMergeFields = (
	newObjId: string,
	newFieldValue: string,
	fieldsToDelete: ModifiedInstruction[],
	dispatcher: Dispatch<ActionType>,
) => {
	dispatcher({
		type: actions.deleteMultiple,
		payload: fieldsToDelete.map((f) => f.objId),
	});

	dispatcher({
		type: actions.addMergedField,
		payload: {
			objId: newObjId,
			description: newFieldValue,
			stepNumber: fieldsToDelete[0]?.stepNumber,
		},
	});
};
