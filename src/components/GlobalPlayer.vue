<!-- @format -->

<script setup>
import { computed } from "vue";
import {
	Play,
	Pause,
	SkipForward,
	SkipBack,
	Volume2,
	VolumeX,
	Music,
	Shuffle,
	Repeat,
	Repeat1,
} from "lucide-vue-next";
import {
	currentMedia,
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
	audio,
} from "../store/player";

const formatTime = (secs) => {
	if (isNaN(secs) || secs === null) return "0:00";
	const minutes = Math.floor(secs / 60);
	const seconds = Math.floor(secs % 60);
	return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

const seek = (event) => {
	if (!audio || !duration.value) return;
	isSeeking.value = true;

	const val = parseFloat(event.target.value);
	audio.currentTime = val;
	currentTime.value = val;
	progress.value = (val / duration.value) * 100;

	isSeeking.value = false;
};

const adjustVolume = (event) => {
	setVolume(parseFloat(event.target.value));
};

const toggleMute = () => {
	if (volume.value > 0) {
		setVolume(0);
	} else {
		setVolume(0.7);
	}
};

/* ---------------- LOOP / REPEAT SYSTEM ---------------- */
const toggleRepeat = () => {
	const modes = ["off", "all", "one"];
	const i = modes.indexOf(repeatMode.value);
	repeatMode.value = modes[(i + 1) % modes.length];
};

const repeatLabel = computed(() => {
	if (repeatMode.value === "one") return "1";
	if (repeatMode.value === "all") return "A";
	return "";
});

const repeatClass = computed(() => {
	if (repeatMode.value === "one") return "text-yellow-400";
	if (repeatMode.value === "all") return "text-red-500";
	return "text-zinc-400 hover:text-white";
});

const repeatIcon = computed(() =>
	repeatMode.value === "one" ? Repeat1 : Repeat
);

const isAudioFile = computed(() => {
	if (!currentMedia.value) return false;
	return (
		currentMedia.value.type?.startsWith("audio") ||
		!currentMedia.value.type?.startsWith("video")
	);
});
</script>

<template>
	<div class="fixed bottom-0 inset-x-0 z-40">
		<transition name="slide-player">
			<div
				v-if="currentMedia && isAudioFile"
				class="bg-zinc-950/80 backdrop-blur-xl border-t border-zinc-900 text-zinc-200 px-4 py-3 md:px-8 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"
			>
				<div
					class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4"
				>
					<div class="flex items-center gap-3 w-full md:w-1/4 min-w-0">
						<div
							class="w-12 h-12 rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 flex items-center justify-center shrink-0 shadow-inner"
						>
							<Music
								class="w-5 h-5 text-red-500 animate-pulse"
								v-if="isPlaying"
							/>
							<Music class="w-5 h-5 text-zinc-500" v-else />
						</div>
						<div class="min-w-0 flex-1">
							<p class="text-sm font-semibold text-zinc-100 truncate">
								{{ currentMedia.title || currentMedia.name }}
							</p>
							<p
								class="text-xs text-zinc-500 truncate mt-0.5 uppercase tracking-wider font-mono"
							>
								{{ currentMedia.artist || "Audio File" }}
							</p>
						</div>
					</div>

					<div class="flex flex-col items-center gap-2 w-full md:w-2/4">
						<div class="flex items-center gap-5">
							<button
								@click="isShuffleMode = !isShuffleMode"
								class="transition-colors p-1 relative"
								title="Shuffle"
							>
								<Shuffle
									class="w-4 h-4"
									:class="
										isShuffleMode
											? 'text-red-500'
											: 'text-zinc-400 hover:text-white'
									"
								/>
							</button>

							<button
								@click="prevTrack"
								class="text-zinc-400 hover:text-white transition-colors p-1"
							>
								<SkipBack class="w-5 h-5 fill-current" />
							</button>

							<button
								@click="isPlaying ? pause() : play()"
								class="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md"
							>
								<Pause
									v-if="isPlaying"
									class="w-4 h-4 fill-current text-black"
								/>
								<Play v-else class="w-4 h-4 fill-current text-black ml-0.5" />
							</button>

							<button
								@click="nextTrack"
								class="text-zinc-400 hover:text-white transition-colors p-1"
							>
								<SkipForward class="w-5 h-5 fill-current" />
							</button>

							<button
								@click="toggleRepeat"
								class="transition-colors p-1 relative flex items-center justify-center"
								title="Repeat Mode"
							>
								<component
									:is="repeatIcon"
									class="w-4 h-4"
									:class="repeatClass"
								/>
								<span
									v-if="repeatLabel"
									class="absolute -top-1.5 -right-1.5 text-[8px] font-bold px-1 bg-zinc-900 rounded-full border border-zinc-800 scale-90"
									:class="repeatClass"
								>
									{{ repeatLabel }}
								</span>
							</button>
						</div>

						<div
							class="w-full flex items-center gap-3 text-[11px] font-mono font-medium text-zinc-500 select-none"
						>
							<span class="w-10 text-right text-zinc-400">{{
								formatTime(currentTime)
							}}</span>
							<input
								type="range"
								min="0"
								:max="duration || 100"
								:value="currentTime"
								@input="seek"
								class="flex-1 accent-red-500 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer hover:accent-red-400 transition-all"
							/>
							<span class="w-10 text-left">{{ formatTime(duration) }}</span>
						</div>
					</div>

					<div
						class="hidden md:flex items-center justify-end gap-3 w-full md:w-1/4"
					>
						<button
							@click="toggleMute"
							class="text-zinc-400 hover:text-white transition-colors"
						>
							<VolumeX v-if="volume === 0" class="w-4 h-4" />
							<Volume2 v-else class="w-4 h-4" />
						</button>
						<input
							type="range"
							min="0"
							max="1"
							step="0.01"
							:value="volume"
							@input="adjustVolume"
							class="w-20 accent-zinc-200 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
						/>
					</div>
				</div>
			</div>
		</transition>
	</div>
</template>

<style scoped>
.slide-player-enter-active,
.slide-player-leave-active {
	transition:
		transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
		opacity 0.3s linear;
}
.slide-player-enter-from,
.slide-player-leave-to {
	transform: translateY(100%);
	opacity: 0;
}
input[type="range"]::-webkit-slider-runnable-track {
	background: transparent;
}
input[type="range"]::-moz-range-track {
	background: transparent;
}
</style>
