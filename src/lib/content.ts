import { getEntry } from 'astro:content';

export async function getRequiredSiteEntry(context?: string) {
	const entry = await getEntry('site', 'site');
	if (!entry) {
		throw new Error(
			`Missing content entry: site/site${context ? ` (${context})` : ''}`
		);
	}

	return entry;
}
