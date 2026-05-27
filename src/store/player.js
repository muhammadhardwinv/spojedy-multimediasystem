/** @format */
import { ref } from "vue";

export const playlist = ref([]);
export const currentIndex = ref(0);

export const currentMedia = ref(null);
export const isPlaying = ref(false);

export const isShuffleMode = ref(false);

/**
 * repeatMode:
 * off  = stop at end
 * all  = loop <playl></playl>ist
 * one  = repeat current song
 */
export const repeatMode = ref("off");

export const audio = new Audio();

const sync = () => {
	currentMedia.value = playlist.value[currentIndex.value] || null;

	if (currentMedia.value?.src) {
		audio.src = currentMedia.value.src;
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

	// cleanup old media
	if (audio) {
		audio.pause();
		audio.currentTime = 0;
	}

	audio.src = currentMedia.value.src;

	// IMPORTANT: reset video elements in DOM (stop grid previews)
	document.querySelectorAll("video").forEach((v) => {
		v.pause();
		v.currentTime = 0;
	});

	await audio.play();
	isPlaying.value = true;
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

	// repeat ONE
	if (repeatMode.value === "one") {
		audio.currentTime = 0;
		await play();
		return;
	}

	// shuffle
	if (isShuffleMode.value) {
		currentIndex.value = getRandomIndex();
		sync();
		await play();
		return;
	}

	// normal next
	if (currentIndex.value < playlist.value.length - 1) {
		currentIndex.value++;
		sync();
		await play();
		return;
	}

	// loop ALL
	if (repeatMode.value === "all") {
		currentIndex.value = 0;
		sync();
		await play();
		return;
	}

	// end
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
