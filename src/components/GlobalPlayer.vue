<!-- @format -->

<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";

import {
	currentMedia,
	isPlaying,
	play,
	pause,
	audio,
	nextTrack,
	prevTrack,
	isShuffleMode,
	repeatMode,
} from "../store/player";

import {
	Play,
	Pause,
	SkipBack,
	SkipForward,
	Shuffle,
	Repeat,
	Repeat1,
	Video,
	Music,
	Volume2,
} from "lucide-vue-next";

/* ---------------- PLAYER ---------------- */
const currentTime = ref(0);
const duration = ref(0);
const progress = ref(0);

const isVideoMode = ref(false);

/* ---------------- FORMAT TIME ---------------- */
const formatTime = (time) => {
	if (!time || isNaN(time)) return "0:00";

	const minutes = Math.floor(time / 60);

	const seconds = Math.floor(time % 60)
		.toString()
		.padStart(2, "0");

	return `${minutes}:${seconds}`;
};

/* ---------------- TOGGLE ---------------- */
const togglePlayer = async () => {
	if (isPlaying.value) {
		pause();
	} else {
		await play();
	}
};

const toggleShuffle = () => {
	isShuffleMode.value = !isShuffleMode.value;
};

const toggleRepeat = () => {
	const modes = ["off", "all", "one"];

	const i = modes.indexOf(repeatMode.value);

	repeatMode.value = modes[(i + 1) % modes.length];
};

/* ---------------- SEEK ---------------- */
const updateProgress = () => {
	currentTime.value = audio.currentTime || 0;

	duration.value = audio.duration || 0;

	if (duration.value > 0) {
		progress.value = (currentTime.value / duration.value) * 100;
	}
};

const seek = (e) => {
	if (!duration.value) return;

	const value = Number(e.target.value);

	progress.value = value;

	audio.currentTime = (value / 100) * duration.value;
};

/* ---------------- VIDEO CHECK ---------------- */
const hasVideo = computed(() => {
	return currentMedia.value?.type?.startsWith("video");
});

/* ---------------- MEDIA LABEL ---------------- */
const mediaLabel = computed(() => {
	if (!currentMedia.value) return "";

	switch (currentMedia.value.source) {
		case "local":
			return "Local Media";

		case "youtube":
			return "YouTube";

		case "spotify":
			return "Spotify";

		case "stream":
			return "Streaming";

		case "download":
			return "Downloaded";

		default:
			return "Unknown Source";
	}
});

/* ---------------- EVENTS ---------------- */
onMounted(() => {
	audio.addEventListener("timeupdate", updateProgress);

	audio.addEventListener("loadedmetadata", updateProgress);
});

onUnmounted(() => {
	audio.removeEventListener("timeupdate", updateProgress);

	audio.removeEventListener("loadedmetadata", updateProgress);
});
</script>

<template>
	<transition name="fade">
		<div
			v-if="currentMedia"
			class="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-black/90 backdrop-blur-2xl"
		>
			<!-- VIDEO MODE -->
			<div
				v-if="isVideoMode"
				class="aspect-video bg-black flex items-center justify-center"
			>
				<video
					v-if="hasVideo"
					:src="currentMedia.src"
					class="w-full max-h-[60vh]"
					controls
					autoplay
				/>

				<div
					v-else
					class="flex flex-col items-center justify-center gap-4 py-20"
				>
					<img
						v-if="currentMedia.image"
						:src="currentMedia.image"
						class="w-40 h-40 rounded-2xl object-cover opacity-60"
					/>

					<Video class="w-16 h-16 text-white/30" />

					<p class="text-white/40">No video available</p>
				</div>
			</div>

			<!-- PLAYER -->
			<div class="p-4">
				<div class="flex flex-col xl:flex-row xl:items-center gap-6">
					<!-- LEFT -->
					<div class="flex items-center gap-4 min-w-0 xl:w-[320px]">
						<!-- THUMB -->
						<div
							class="relative w-16 h-16 rounded-2xl overflow-hidden bg-white/5 flex-shrink-0 border border-white/10"
						>
							<img
								v-if="currentMedia.image"
								:src="currentMedia.image"
								class="w-full h-full object-cover"
							/>

							<div
								v-else
								class="w-full h-full flex items-center justify-center"
							>
								<Music class="text-white/40" />
							</div>

							<div
								v-if="isPlaying"
								class="absolute inset-0 bg-black/20 backdrop-blur-[1px]"
							/>
						</div>

						<!-- INFO -->
						<div class="min-w-0">
							<p class="font-semibold text-white truncate text-sm">
								{{ currentMedia.name || currentMedia.title }}
							</p>

							<p class="text-xs text-white/40 truncate mt-1">
								{{ mediaLabel }}
							</p>
						</div>
					</div>

					<!-- CENTER -->
					<div class="flex-1 min-w-0">
						<!-- CONTROLS -->
						<div class="flex items-center justify-center gap-5 mb-3">
							<!-- SHUFFLE -->
							<button @click="toggleShuffle" class="transition hover:scale-110">
								<Shuffle
									class="w-5 h-5"
									:class="isShuffleMode ? 'text-red-500' : 'text-white/40'"
								/>
							</button>

							<!-- PREV -->
							<button @click="prevTrack" class="hover:scale-110 transition">
								<SkipBack class="w-6 h-6 text-white" />
							</button>

							<!-- PLAY -->
							<button
								@click="togglePlayer"
								class="w-14 h-14 rounded-full bg-red-500 hover:bg-red-400 transition flex items-center justify-center shadow-lg shadow-red-500/30 hover:scale-105"
							>
								<Pause v-if="isPlaying" class="w-7 h-7 text-white" />

								<Play v-else class="w-7 h-7 text-white ml-1" />
							</button>

							<!-- NEXT -->
							<button @click="nextTrack" class="hover:scale-110 transition">
								<SkipForward class="w-6 h-6 text-white" />
							</button>

							<!-- REPEAT -->
							<button @click="toggleRepeat" class="transition hover:scale-110">
								<Repeat1
									v-if="repeatMode === 'one'"
									class="w-5 h-5 text-yellow-400"
								/>

								<Repeat
									v-else
									class="w-5 h-5"
									:class="
										repeatMode === 'all' ? 'text-red-500' : 'text-white/40'
									"
								/>
							</button>
						</div>

						<!-- PROGRESS -->
						<div class="flex items-center gap-3">
							<span class="text-[11px] text-white/40 w-10 text-right">
								{{ formatTime(currentTime) }}
							</span>

							<input
								type="range"
								min="0"
								max="100"
								step="0.1"
								:value="progress"
								@input="seek"
								class="flex-1 accent-red-500 cursor-pointer"
							/>

							<span class="text-[11px] text-white/40 w-10">
								{{ formatTime(duration) }}
							</span>
						</div>
					</div>

					<!-- RIGHT -->
					<div
						class="flex items-center justify-center xl:justify-end gap-4 xl:w-[220px]"
					>
						<!-- VOLUME -->
						<div
							class="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/5"
						>
							<Volume2 class="w-4 h-4 text-white/50" />

							<input
								type="range"
								min="0"
								max="1"
								step="0.01"
								:value="audio.volume"
								@input="audio.volume = Number($event.target.value)"
								class="w-24 accent-red-500 cursor-pointer"
							/>
						</div>

						<!-- VIDEO -->
						<button
							@click="isVideoMode = !isVideoMode"
							class="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center hover:bg-white/[0.06] transition"
						>
							<Video
								class="w-5 h-5"
								:class="isVideoMode ? 'text-red-500' : 'text-white/40'"
							/>
						</button>
					</div>
				</div>
			</div>
		</div>
	</transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
