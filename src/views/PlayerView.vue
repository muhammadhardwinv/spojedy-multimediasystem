<!-- @format -->

<script setup>
import { ref, computed, watch, nextTick } from "vue";

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
	Tv,
	Heart,
	Headphones,
	Video,
	X,
} from "lucide-vue-next";

import {
	currentMedia,
	playlist,
	currentIndex,
	isPlaying,
	isShuffleMode,
	repeatMode,
	currentTime,
	duration,
	progress,
	isSeeking,
	volume,
	setVolume,
	play,
	pause,
	nextTrack,
	prevTrack,
	setPlaylist,
	audio,
} from "../store/player";

import { toggleFavorite, isFavorite } from "../store/favorites";

/* GLOBAL THEME */
import { currentTheme } from "../store/user";

/* ---------------- THEME ---------------- */
const theme = computed(() => currentTheme.value);

const carouselRef = ref(null);

const videoRef = ref(null);

/* ---------------- PLAYLIST ---------------- */
const playlistView = computed(() => playlist.value);

/* ---------------- VIDEO CHECK ---------------- */
const isVideoFormat = (mediaItem) => {
	if (!mediaItem) return false;

	return (
		mediaItem.type?.startsWith("video/") ||
		mediaItem.videoUrl ||
		mediaItem.name?.match(/\.(mp4|mkv|webm|mov|avi)$/i) ||
		mediaItem.title?.match(/\.(mp4|mkv|webm|mov|avi)$/i)
	);
};

/* ---------------- ACTIVE CHECK ---------------- */
const isActive = (song) => {
	if (!currentMedia.value || !song) return false;

	const currentTitle =
		currentMedia.value.title || currentMedia.value.name || "";

	const targetTitle = song.title || song.name || "";

	const currentArtist = currentMedia.value.artist || "Unknown Artist";

	const targetArtist = song.artist || "Unknown Artist";

	return currentTitle === targetTitle && currentArtist === targetArtist;
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

/* ---------------- TOGGLE PLAY ---------------- */
const togglePlay = async () => {
	if (isPlaying.value) {
		pause();

		if (isVideoFormat(currentMedia.value) && videoRef.value) {
			videoRef.value.pause();
		}
	} else {
		try {
			await play();

			if (isVideoFormat(currentMedia.value) && videoRef.value) {
				videoRef.value.play().catch(() => {});
			}
		} catch (err) {
			console.log(err);
		}
	}
};

const next = () => nextTrack();

const prev = () => prevTrack();

/* ---------------- REPEAT ---------------- */
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

	return theme.value.textMuted;
});

const repeatIcon = computed(() =>
	repeatMode.value === "one" ? Repeat1 : Repeat
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

/* ---------------- SEEK ---------------- */
const seek = (e) => {
	isSeeking.value = true;

	const value = parseFloat(e.target.value);

	if (isVideoFormat(currentMedia.value) && videoRef.value) {
		if (!videoRef.value.duration) return;

		const seekTime = (value / 100) * videoRef.value.duration;

		videoRef.value.currentTime = seekTime;

		currentTime.value = seekTime;

		progress.value = value;
	} else if (audio && duration.value) {
		const seekTime = (value / 100) * duration.value;

		audio.currentTime = seekTime;

		currentTime.value = seekTime;

		progress.value = value;
	}

	isSeeking.value = false;
};

/* ---------------- VIDEO EVENTS ---------------- */
const onVideoTimeUpdate = () => {
	if (isVideoFormat(currentMedia.value) && videoRef.value && !isSeeking.value) {
		currentTime.value = videoRef.value.currentTime || 0;

		duration.value = videoRef.value.duration || 0;

		if (videoRef.value.duration > 0) {
			progress.value =
				(videoRef.value.currentTime / videoRef.value.duration) * 100;
		}
	}
};

const onVideoLoadedMetadata = () => {
	if (isVideoFormat(currentMedia.value) && videoRef.value) {
		currentTime.value = 0;

		duration.value = videoRef.value.duration || 0;

		progress.value = 0;

		videoRef.value.volume = volume.value;
	}
};

/* ---------------- WATCHERS ---------------- */
watch(isPlaying, (playing) => {
	if (isVideoFormat(currentMedia.value) && videoRef.value) {
		if (playing) {
			videoRef.value.play().catch(() => {});
		} else {
			videoRef.value.pause();
		}
	}
});

watch(
	() => currentMedia.value,
	async (newMedia) => {
		if (isVideoFormat(newMedia)) {
			await nextTick();

			if (videoRef.value && isPlaying.value) {
				videoRef.value.play().catch(() => {});
			}
		}
	}
);

watch(currentIndex, async (i) => {
	await nextTick();

	const container = carouselRef.value;
	if (!container) return;

	const items = container.querySelectorAll("[data-song]");
	const el = items[i];

	// Simply do nothing here, or highlight the element via CSS/Classes
	// instead of forcing the browser to scroll.
	if (!el) return;
});
</script>

<template>
	<div
		class="min-h-screen px-6 py-10 pb-40 overflow-x-hidden relative transition-all duration-300"
		:class="[theme.bg, theme.text]"
	>
		<div class="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10 items-start">
			<!-- PLAYER PANEL -->
			<div class="w-full lg:w-[380px] lg:sticky lg:top-8 flex-shrink-0">
				<div
					:class="[
						theme.card,
						theme.border,
						'rounded-[32px] overflow-hidden border backdrop-blur-xl',
					]"
				>
					<!-- COVER -->
					<div class="relative aspect-square overflow-hidden bg-black">
						<img
							v-if="currentMedia?.image"
							:src="currentMedia.image"
							class="w-full h-full object-cover"
						/>

						<div
							v-else
							class="w-full h-full flex items-center justify-center"
							:class="theme.card"
						>
							<Music2 class="w-20 h-20 opacity-20" />
						</div>

						<div
							class="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none"
						/>

						<!-- STATUS -->
						<div
							v-if="isPlaying"
							class="absolute top-5 left-5 px-3 py-1 rounded-full text-xs backdrop-blur-md z-10"
							:class="theme.tabActive"
						>
							{{
								isVideoFormat(currentMedia)
									? "Video Mode Active"
									: "Now Playing"
							}}
						</div>

						<!-- MEDIA TYPE -->
						<div class="absolute top-5 right-5 z-10">
							<div
								class="p-2 rounded-full bg-black/60 border backdrop-blur-md flex items-center justify-center"
								:class="theme.border"
							>
								<Tv
									v-if="isVideoFormat(currentMedia)"
									class="w-4 h-4 text-red-400"
								/>

								<Headphones v-else class="w-4 h-4 text-green-400" />
							</div>
						</div>
					</div>

					<!-- PLAYER BODY -->
					<div class="p-6">
						<div>
							<h1 class="text-2xl font-bold truncate">
								{{ currentMedia?.title || currentMedia?.name || "No Track" }}
							</h1>

							<p class="mt-1 truncate" :class="theme.textMuted">
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

							<div
								class="flex justify-between text-xs mt-2"
								:class="theme.textMuted"
							>
								<span>
									{{ formatTime(currentTime) }}
								</span>

								<span>
									{{ formatTime(duration) }}
								</span>
							</div>
						</div>

						<!-- CONTROLS -->
						<div class="mt-8">
							<div class="flex items-center justify-center gap-5">
								<button
									@click="isShuffleMode = !isShuffleMode"
									class="transition hover:scale-110"
								>
									<Shuffle
										class="w-5 h-5"
										:class="isShuffleMode ? 'text-red-500' : theme.textMuted"
									/>
								</button>

								<button @click="prev" class="hover:scale-110 transition">
									<SkipBack class="w-7 h-7" />
								</button>

								<button
									@click="togglePlay"
									:class="[
										theme.accent,
										'w-16 h-16 rounded-full transition flex items-center justify-center shadow-lg hover:scale-105',
									]"
								>
									<Pause v-if="isPlaying" class="w-8 h-8" />

									<Play v-else class="w-8 h-8 ml-1" />
								</button>

								<button @click="next" class="hover:scale-110 transition">
									<SkipForward class="w-7 h-7" />
								</button>

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

							<!-- BOTTOM ACTIONS -->
							<div class="mt-8 flex items-center justify-between gap-4">
								<button
									@click="toggleFavorite(currentMedia)"
									:class="[
										theme.card,
										theme.border,
										'flex items-center gap-2 px-4 py-3 rounded-2xl border transition hover:scale-[1.02]',
									]"
								>
									<!-- Dynamic Icon: Heart if favorited, CirclePlus if not -->
									<component
										:is="isFavorite(currentMedia) ? Heart : CirclePlus"
										class="w-5 h-5 transition-colors duration-300"
										:class="
											isFavorite(currentMedia)
												? 'text-red-500 fill-red-500'
												: theme.textMuted
										"
									/>

									<span class="text-sm"> Favorite </span>
								</button>

								<div
									:class="[
										theme.card,
										theme.border,
										'flex items-center gap-3 px-4 py-3 rounded-2xl border',
									]"
								>
									<Volume2 class="w-4 h-4" :class="theme.textMuted" />

									<input
										type="range"
										min="0"
										max="1"
										step="0.01"
										:value="volume"
										@input="(e) => setVolume(parseFloat(e.target.value))"
										class="w-24 accent-red-500"
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- PLAYLIST -->
			<div class="flex-1 min-w-0 space-y-6">
				<!-- HEADER -->
				<div class="flex items-center gap-3">
					<div
						:class="[
							theme.card,
							theme.border,
							'w-14 h-14 rounded-2xl border flex items-center justify-center',
						]"
					>
						<ListMusic class="w-7 h-7" />
					</div>

					<div>
						<h2 class="text-3xl font-bold">Playlist Queue</h2>

						<p :class="theme.textMuted">
							{{ playlistView.length }}
							tracks available
						</p>
					</div>
				</div>

				<!-- SONGS -->
				<div ref="carouselRef" class="space-y-4">
					<div
						v-for="(song, index) in playlistView"
						:key="index"
						data-song
						@click="playTrack(song, index)"
						:class="[
							theme.card,
							theme.border,
							'group flex items-center gap-5 rounded-3xl p-4 border transition-all duration-300 cursor-pointer hover:scale-[1.01]',
							isActive(song) ? `${theme.tabActive} shadow-lg` : '',
						]"
					>
						<!-- COVER -->
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
								class="w-full h-full flex items-center justify-center"
								:class="theme.card"
							>
								<Music2 class="w-8 h-8 opacity-30" />
							</div>

							<div
								class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"
							/>

							<button
								:class="[
									theme.accent,
									'absolute bottom-2 right-2 w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition',
								]"
							>
								<Pause v-if="isActive(song) && isPlaying" class="w-5 h-5" />

								<Play v-else class="w-5 h-5 ml-0.5" />
							</button>
						</div>

						<!-- INFO -->
						<div class="flex-1 min-w-0">
							<h3 class="font-semibold text-lg truncate">
								{{ song.title || song.name }}
							</h3>

							<p class="truncate mt-1" :class="theme.textMuted">
								{{ song.artist || "Unknown Artist" }}
							</p>

							<div class="flex items-center gap-2 mt-3 text-xs">
								<Tv v-if="isVideoFormat(song)" class="w-4 h-4 text-red-400" />

								<Music2 class="w-4 h-4" :class="theme.textMuted" />

								<span
									:class="
										isVideoFormat(song) ? 'text-red-400' : theme.textMuted
									"
								>
									{{ isVideoFormat(song) ? "Video Resource" : "Audio Track" }}
								</span>
							</div>
						</div>

						<!-- STATUS -->
						<div class="flex items-center gap-2">
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

		<!-- VIDEO MODAL -->
		<transition name="pop-theater">
			<div
				v-if="currentMedia && isVideoFormat(currentMedia) && isPlaying"
				class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 sm:p-6 md:p-10"
				@click="togglePlay"
			>
				<div
					@click.stop
					:class="[
						theme.card,
						theme.border,
						'w-full max-w-5xl aspect-video border rounded-2xl overflow-hidden shadow-2xl flex flex-col relative bg-black',
					]"
				>
					<!-- TOP -->
					<div
						class="absolute top-4 inset-x-4 z-30 flex items-center justify-between"
					>
						<div
							class="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-2 max-w-[70%]"
						>
							<Video class="w-3.5 h-3.5 text-red-400 shrink-0" />

							<span class="text-xs font-medium truncate">
								{{ currentMedia.title || currentMedia.name }}
							</span>
						</div>

						<button
							@click="togglePlay"
							class="w-8 h-8 rounded-xl bg-black/60 flex items-center justify-center transition-all hover:scale-105"
						>
							<X class="w-4 h-4" />
						</button>
					</div>

					<!-- VIDEO -->
					<div
						class="flex-1 w-full h-full bg-black flex items-center justify-center relative"
					>
						<video
							ref="videoRef"
							:src="
								currentMedia.videoUrl || currentMedia.url || currentMedia.src
							"
							class="w-full h-full object-contain"
							controls
							playsinline
							@timeupdate="onVideoTimeUpdate"
							@loadedmetadata="onVideoLoadedMetadata"
						/>
					</div>
				</div>
			</div>
		</transition>
	</div>
</template>

<style scoped>
* {
	transition:
		background-color 0.25s ease,
		border-color 0.25s ease,
		color 0.25s ease;
}

.pop-theater-enter-active,
.pop-theater-leave-active {
	transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.pop-theater-enter-from,
.pop-theater-leave-to {
	opacity: 0;
	transform: scale(0.97) translateY(8px);
}
</style>
