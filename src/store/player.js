/** @format */

import { ref, computed, watch } from "vue";

export const playlist = ref([]);
export const currentIndex = ref(0);

export const currentMedia = ref(null);
export const isPlaying = ref(false);

export const isShuffleMode = ref(false);
export const repeatMode = ref("off"); // 'off', 'all', 'one'

export const videoElement = ref(null);

// --- SHARED TIME TRACKING STATE ---
export const currentTime = ref(0);
export const duration = ref(0);
export const progress = ref(0);
export const isSeeking = ref(false); // Flag lock

// --- SINGLE VOLUME SYSTEM SOURCE OF TRUTH ---
export const volume = ref(1);
export const audio = new Audio();

// Native element tracker hooks
audio.addEventListener("timeupdate", () => {
	if (isSeeking.value) return;

	currentTime.value = audio.currentTime;

	if (audio.duration) {
		progress.value = (audio.currentTime / audio.duration) * 100;
	}
});

audio.addEventListener("loadedmetadata", () => {
	duration.value = audio.duration || 0;
});

audio.addEventListener("durationchange", () => {
	duration.value = audio.duration || 0;
});

audio.addEventListener("ended", () => {
	nextTrack();
});

export const setVolume = (val) => {
	const normalizedVolume = Math.max(0, Math.min(Number(val), 1));

	volume.value = normalizedVolume;

	if (audio) {
		audio.volume = normalizedVolume;
	}

	document.querySelectorAll("video").forEach((video) => {
		video.volume = normalizedVolume;
	});
};

const sync = () => {
	currentMedia.value = playlist.value[currentIndex.value] || null;

	// Clear times on swap
	currentTime.value = 0;
	duration.value = 0;
	progress.value = 0;

	if (currentMedia.value?.src) {
		audio.src = currentMedia.value.src;
		audio.load();
	}
};

export const setPlaylist = (list = [], index = 0) => {
	if (!Array.isArray(list) || list.length === 0) return;

	playlist.value = list;

	currentIndex.value = Math.max(0, Math.min(index, list.length - 1));

	sync();
};

export const play = async () => {
	if (!currentMedia.value?.src) return;

	// IMPORTANT: If format is video,
	// stop background audio playing completely
	const isVideo =
		currentMedia.value.type?.startsWith("video/") ||
		currentMedia.value.videoUrl ||
		currentMedia.value.name?.match(/\.(mp4|mkv|webm|mov|avi)$/i);

	if (isVideo) {
		audio.pause();

		isPlaying.value = true; // Still true so theater overlay displays

		return;
	}

	audio.volume = volume.value;

	// stop random layout preview leaks
	document.querySelectorAll("video").forEach((v) => {
		v.pause();
		v.currentTime = 0;
		v.volume = volume.value;
	});

	try {
		await audio.play();

		isPlaying.value = true;
	} catch (err) {
		console.error("Playback blocked or failed:", err);

		isPlaying.value = false;
	}
};

export const pause = () => {
	audio.pause();

	isPlaying.value = false;
};

const getRandomIndex = () => {
	if (playlist.value.length <= 1) return currentIndex.value;

	let i;

	do {
		i = Math.floor(Math.random() * playlist.value.length);
	} while (i === currentIndex.value);

	return i;
};

export const nextTrack = async () => {
	if (!playlist.value.length) return;

	if (repeatMode.value === "one") {
		audio.currentTime = 0;

		await play();

		return;
	}

	if (isShuffleMode.value) {
		currentIndex.value = getRandomIndex();

		sync();

		await play();

		return;
	}

	if (currentIndex.value < playlist.value.length - 1) {
		currentIndex.value++;

		sync();

		await play();

		return;
	}

	if (repeatMode.value === "all") {
		currentIndex.value = 0;

		sync();

		await play();

		return;
	}

	pause();
};

export const prevTrack = async () => {
	if (!playlist.value.length) return;

	if (audio.currentTime > 3) {
		audio.currentTime = 0;

		return;
	}

	if (currentIndex.value > 0) {
		currentIndex.value--;

		sync();

		await play();

		return;
	}

	if (repeatMode.value === "all") {
		currentIndex.value = playlist.value.length - 1;

		sync();

		await play();
	}
};
/*
|--------------------------------------------------------------------------
| DYNAMIC PAGE TITLE
|--------------------------------------------------------------------------
*/

let titleInterval = null;

watch(
	[currentMedia, isPlaying],
	([media, playing]) => {
		// CLEAR OLD LOOP
		if (titleInterval) {
			clearInterval(titleInterval);
			titleInterval = null;
		}

		// FALLBACK
		if (!media) {
			document.title = "Spojedy";
			return;
		}

		// PLAY / PAUSE ICON
		const icon = playing ? "▶" : "⏸";

		// MEDIA TYPE
		const mediaType =
			media.type?.startsWith("video/") ||
			media.videoUrl ||
			media.name?.match(/\.(mp4|mkv|webm|mov|avi)$/i)
				? "🎬"
				: "🎵";

		// OPTIONAL ARTIST
		const artist = media.artist ? ` — ${media.artist}` : "";

		// BASE TITLE
		const baseTitle = `${mediaType} ${icon} ${
			media.title || media.name
		}${artist} • Spojedy   `;

		// INITIAL
		document.title = baseTitle;

		// SCROLL EFFECT
		let i = 0;

		titleInterval = setInterval(() => {
			const scrolling = baseTitle.slice(i) + baseTitle.slice(0, i);

			document.title = scrolling;

			i++;

			if (i >= baseTitle.length) {
				i = 0;
			}
		}, 250);
	},
	{
		immediate: true,
	}
);
