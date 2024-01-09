/** @jsxImportSource @emotion/react */
import { useEffect, useState } from 'react';
import { workflowContentUrl } from 'utils/workflow';

interface PinboardTrackAndPreselectProps {
	maybeComposerId: string | undefined;
	maybeTitle: string | undefined;
}

export const PinboardTrackAndPreselect = ({
	maybeComposerId,
	maybeTitle,
}: PinboardTrackAndPreselectProps) => {
	const [maybeWorkflowId, setMaybeWorkflowId] = useState<string>();

	useEffect(() => {
		(async () => {
			if (!maybeComposerId) return;
			const workflowLookupResponse = await fetch(
				`${workflowContentUrl}/${maybeComposerId}`,
				{
					credentials: 'include',
				},
			);
			if (workflowLookupResponse.ok) {
				return setMaybeWorkflowId(
					(await workflowLookupResponse.json()).data.id,
				);
			} else if (workflowLookupResponse.status === 419) {
				console.error(
					"Not logged in to Workflow, Pinboard won't be pre-selected",
				);
			} else if (workflowLookupResponse.status === 404) {
				const trackInWorkflowResponse = await fetch(workflowContentUrl, {
					method: 'POST',
					credentials: 'include',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						composerId: maybeComposerId,
						title:
							window.prompt(
								'Please enter the working title for workflow?',
								maybeTitle,
							) || maybeTitle,
						status: 'Writers', //TODO is Subs a more sensible starting status
						section: { name: 'Recipes Data' },
						contentType: 'article', // TODO is this one actually needed
						prodOffice: 'UK', //TODO is everything going to be UK based??
					}),
				});
				if (trackInWorkflowResponse.ok) {
					return setMaybeWorkflowId(
						(await trackInWorkflowResponse.json()).data.stubId,
					);
				}
			}
			console.error(
				"Failed looking up in workflow, pinboard won't be pre-selected",
				workflowLookupResponse,
			);
		})();
	}, [maybeComposerId]);

	return maybeWorkflowId ? (
		// @ts-ignore -- this element is not valid JSX but IS meaningful/detected by Pinboard
		<pinboard-preselect
			data-composer-id={maybeComposerId}
			data-composer-section="Recipes Data"
		/>
	) : null;
};
