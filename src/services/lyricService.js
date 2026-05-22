/** @format */

/**
 * Free lyrics API (no key required)
 * Genius is NOT usable directly from frontend safely
 */
export const fetchLyrics = async (title, artist) => {
	try {
		const res = await fetch(
			`https://api.lyrics.ovh/v1/${encodeURIComponent(
				artist
			)}/${encodeURIComponent(title)}`
		);

		const data = await res.json();

		if (!data.lyrics) return [];

		return data.lyrics.split("\n").filter((line) => line.trim() !== "");
	} catch (err) {
		return [];
	}
};
