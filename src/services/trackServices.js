/** @format */

// iTunes search (music + thumbnails + preview audio)
const ITUNES_API = "https://itunes.apple.com/search?media=music&limit=10";

/**
 * Search tracks from iTunes API
 * returns normalized track format for player
 */
export const searchTracks = async (query) => {
	const res = await fetch(`${ITUNES_API}&term=${encodeURIComponent(query)}`);
	const data = await res.json();

	return data.results.map((t) => ({
		id: t.trackId,
		title: t.trackName,
		artist: t.artistName,
		image: t.artworkUrl100?.replace("100x100", "300x300"),
		src: t.previewUrl, // playable audio preview
		duration: t.trackTimeMillis || 0,
		source: "itunes",
	}));
};
