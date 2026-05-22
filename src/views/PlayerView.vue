<!-- @format -->

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from "vue";

import {
	Play,
	Pause,
	SkipBack,
	SkipForward,
	Shuffle,
	Repeat,
	Repeat1,
	CirclePlus,
	Volume2,
	ListMusic,
	Music2,
} from "lucide-vue-next";

import {
	currentMedia,
	playlist,
	currentIndex,
	isPlaying,
	isShuffleMode,
	repeatMode,
	play,
	pause,
	nextTrack,
	prevTrack,
	setPlaylist,
	audio,
} from "../store/player";

import { toggleFavorite, isFavorite } from "../store/favorites";

/* ---------------- STATE ---------------- */
const progress = ref(0);
const currentTime = ref(0);
const duration = ref(0);

const carouselRef = ref(null);

/* ---------------- VIEW ---------------- */
const playlistView = computed(() => playlist.value);

/* ---------------- ACTIVE CHECK ---------------- */
const isActive = (song) => {
	if (!currentMedia.value || !song) return false;

	return (
		currentMedia.value.title === song.title &&
		currentMedia.value.artist === song.artist
	);
};

/* ---------------- PLAY TRACK ---------------- */
const playTrack = async (song, index) => {
	setPlaylist(playlist.value, index);

	try {
		await play();
	} catch (err) {
		console.log(err);
	}
};

/* ---------------- CONTROLS ---------------- */
const togglePlay = async () => {
	if (isPlaying.value) {
		pause();
	} else {
		try {
			await play();
		} catch (err) {
			console.log(err);
		}
	}
};

const next = () => nextTrack();
const prev = () => prevTrack();

/* ---------------- LOOP UI ---------------- */
const toggleRepeat = () => {
	const modes = ["off", "all", "one"];

	const i = modes.indexOf(repeatMode.value);

	repeatMode.value = modes[(i + 1) % modes.length];
};

const repeatLabel = computed(() => {
	if (repeatMode.value === "one") return "1";

	if (repeatMode.value === "all") return "A";

	return "off";
});

const repeatClass = computed(() => {
	if (repeatMode.value === "one") return "text-yellow-400";

	if (repeatMode.value === "all") return "text-red-500";

	return "text-white/40";
});

const repeatIcon = computed(() =>
	repeatMode.value === "one" ? Repeat1 : Repeat,
);

/* ---------------- FORMAT TIME ---------------- */
const formatTime = (time) => {
	if (!time || isNaN(time)) return "0:00";

	const minutes = Math.floor(time / 60);

	const seconds = Math.floor(time % 60)
		.toString()
		.padStart(2, "0");

	return `${minutes}:${seconds}`;
};

/* ---------------- AUDIO PROGRESS ---------------- */
const updateProgress = () => {
	if (!audio) return;

	currentTime.value = audio.currentTime || 0;

	duration.value = audio.duration || 0;

	if (audio.duration > 0) {
		progress.value = (audio.currentTime / audio.duration) * 100;
	}
};

/* ---------------- SEEK ---------------- */
const seek = (e) => {
	if (!audio || !audio.duration) return;

	const value = parseFloat(e.target.value);

	const seekTime = (value / 100) * audio.duration;

	audio.currentTime = seekTime;

	progress.value = value;

	currentTime.value = seekTime;
};

/* ---------------- WATCH SONG CHANGE ---------------- */
watch(
	() => currentMedia.value,
	async () => {
		if (!audio) return;

		updateProgress();

		if (isPlaying.value) {
			try {
				await audio.play();
			} catch (err) {
				console.log(err);
			}
		}
	},
	{ immediate: true },
);

/* ---------------- AUTO SCROLL ---------------- */
watch(currentIndex, async (i) => {
	await nextTick();

	const container = carouselRef.value;

	if (!container) return;

	const items = container.querySelectorAll("[data-song]");

	const el = items[i];

	if (!el) return;

	el.scrollIntoView({
		behavior: "smooth",
		inline: "center",
		block: "nearest",
	});
});

/* ---------------- AUDIO EVENTS ---------------- */
const setupAudioEvents = () => {
	if (!audio) return;

	audio.addEventListener("timeupdate", updateProgress);

	audio.addEventListener("loadedmetadata", updateProgress);

	audio.addEventListener("durationchange", updateProgress);
};

const cleanupAudioEvents = () => {
	if (!audio) return;

	audio.removeEventListener("timeupdate", updateProgress);

	audio.removeEventListener("loadedmetadata", updateProgress);

	audio.removeEventListener("durationchange", updateProgress);
};

onMounted(() => {
	setupAudioEvents();
	updateProgress();
});

onUnmounted(() => {
	cleanupAudioEvents();
});
</script>

<template>
	<div
		class="min-h-screen bg-black text-white px-6 py-10 pb-40 overflow-x-hidden"
	>
		<!-- TOP -->
		<div class="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10 items-start">
			<!-- LEFT PLAYER -->
			<div class="w-full lg:w-[380px] lg:sticky lg:top-8 flex-shrink-0">
				<div
					class="rounded-[32px] overflow-hidden border border-white/10 bg-white/[0.04] backdrop-blur-xl"
				>
					<!-- IMAGE -->
					<div class="relative aspect-square overflow-hidden">
						<img
							v-if="currentMedia?.image"
							:src="currentMedia.image"
							class="w-full h-full object-cover"
						/>

						<div
							v-else
							class="w-full h-full flex items-center justify-center bg-white/[0.03]"
						>
							<Music2 class="w-20 h-20 text-white/20" />
						</div>

						<div
							class="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"
						/>

						<div
							v-if="isPlaying"
							class="absolute top-5 left-5 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-xs text-green-400 backdrop-blur-md"
						>
							Now Playing
						</div>
					</div>

					<!-- CONTENT -->
					<div class="p-6">
						<!-- TITLE -->
						<div>
							<h1 class="text-2xl font-bold truncate">
								{{ currentMedia?.title || "No Track" }}
							</h1>

							<p class="text-white/50 mt-1 truncate">
								{{ currentMedia?.artist || "Unknown Artist" }}
							</p>
						</div>

						<!-- PROGRESS -->
						<div class="mt-6">
							<input
								type="range"
								min="0"
								max="100"
								step="0.1"
								:value="progress"
								@input="seek"
								class="w-full accent-red-500 cursor-pointer"
							/>

							<div class="flex justify-between text-xs text-white/40 mt-2">
								<span>{{ formatTime(currentTime) }}</span>

								<span>{{ formatTime(duration) }}</span>
							</div>
						</div>

						<!-- CONTROLS -->
						<div class="mt-8">
							<div class="flex items-center justify-center gap-5">
								<!-- SHUFFLE -->
								<button
									@click="isShuffleMode = !isShuffleMode"
									class="transition hover:scale-110"
								>
									<Shuffle
										class="w-5 h-5"
										:class="isShuffleMode ? 'text-red-500' : 'text-white/40'"
									/>
								</button>

								<!-- PREV -->
								<button @click="prev" class="hover:scale-110 transition">
									<SkipBack class="w-7 h-7" />
								</button>

								<!-- PLAY -->
								<button
									@click="togglePlay"
									class="w-16 h-16 rounded-full bg-red-500 hover:bg-red-400 transition flex items-center justify-center shadow-lg shadow-red-500/30"
								>
									<Pause v-if="isPlaying" class="w-8 h-8 text-white" />

									<Play v-else class="w-8 h-8 text-white ml-1" />
								</button>

								<!-- NEXT -->
								<button @click="next" class="hover:scale-110 transition">
									<SkipForward class="w-7 h-7" />
								</button>

								<!-- REPEAT -->
								<button
									@click="toggleRepeat"
									class="transition hover:scale-110 relative"
								>
									<component
										:is="repeatIcon"
										class="w-5 h-5"
										:class="repeatClass"
									/>

									<span
										class="absolute -bottom-3 left-1/2 -translate-x-1/2 text-[10px]"
										:class="repeatClass"
									>
										{{ repeatLabel }}
									</span>
								</button>
							</div>

							<!-- EXTRA -->
							<div class="mt-8 flex items-center justify-between gap-4">
								<!-- FAVORITE -->
								<button
									@click="toggleFavorite(currentMedia)"
									class="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] transition"
								>
									<CirclePlus
										class="w-5 h-5"
										:class="
											isFavorite(currentMedia)
												? 'text-red-500'
												: 'text-white/60'
										"
									/>

									<span class="text-sm"> Favorite </span>
								</button>

								<!-- VOLUME -->
								<div
									class="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/10"
								>
									<Volume2 class="w-4 h-4 text-white/50" />

									<input
										type="range"
										min="0"
										max="1"
										step="0.01"
										:value="audio.volume"
										@input="audio.volume = Number($event.target.value)"
										class="w-24 accent-red-500"
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- RIGHT PLAYLIST -->
			<div class="flex-1 min-w-0 space-y-6">
				<!-- HEADER -->
				<div class="flex items-center gap-3">
					<div
						class="w-14 h-14 rounded-2xl bg-red-500/20 flex items-center justify-center"
					>
						<ListMusic class="w-7 h-7 text-red-400" />
					</div>

					<div>
						<h2 class="text-3xl font-bold">Playlist Queue</h2>

						<p class="text-white/40">
							{{ playlistView.length }} tracks available
						</p>
					</div>
				</div>

				<!-- LIST -->
				<div ref="carouselRef" class="space-y-4">
					<div
						v-for="(song, index) in playlistView"
						:key="index"
						data-song
						@click="playTrack(song, index)"
						class="group flex items-center gap-5 rounded-3xl p-4 border transition cursor-pointer"
						:class="
							isActive(song)
								? 'bg-red-500/10 border-red-500/30 scale-[1.01]'
								: 'bg-white/[0.03] border-white/10 hover:border-red-500/30 hover:bg-white/[0.05]'
						"
					>
						<!-- THUMB -->
						<div
							class="relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0"
						>
							<img
								v-if="song.image"
								:src="song.image"
								class="w-full h-full object-cover"
							/>

							<div
								v-else
								class="w-full h-full bg-white/[0.04] flex items-center justify-center"
							>
								<Music2 class="w-8 h-8 text-white/30" />
							</div>

							<div
								class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"
							/>

							<button
								class="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
							>
								<Pause
									v-if="isActive(song) && isPlaying"
									class="w-5 h-5 text-white"
								/>

								<Play v-else class="w-5 h-5 text-white ml-0.5" />
							</button>
						</div>

						<!-- INFO -->
						<div class="flex-1 min-w-0">
							<h3 class="font-semibold text-lg truncate">
								{{ song.title || song.name }}
							</h3>

							<p class="text-white/40 truncate mt-1">
								{{ song.artist || "Unknown Artist" }}
							</p>

							<div class="flex items-center gap-2 mt-3 text-xs text-red-400">
								<Music2 class="w-4 h-4" />

								<span> Playlist Track </span>
							</div>
						</div>

						<!-- ACTIVE -->
						<div
							v-if="isActive(song)"
							class="px-4 py-2 rounded-full text-sm border backdrop-blur-md"
							:class="
								isPlaying
									? 'bg-green-500/10 border-green-500/20 text-green-400'
									: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
							"
						>
							{{ isPlaying ? "Playing" : "Paused" }}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
