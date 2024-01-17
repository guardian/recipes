const workflowDomain = window.location.host
	.replace('recipes', 'workflow')
	.replace('.local.', '.code.');

export const workflowContentUrl = `https://${workflowDomain}/api/content`;

export interface WorkflowLookup {
	[composerId: string]: { assignee: string; status: string };
}
