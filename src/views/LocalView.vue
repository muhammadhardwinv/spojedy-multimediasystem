<!-- @format -->

```vue
<!-- @format -->

<script setup>
import { onMounted, ref, computed } from "vue";

import {
	Upload,
	Play,
	Pause,
	Music,
	Video,
	Image as ImageIcon,
	File,
	Trash2,
	X,
	Layers,
	HardDrive,
	Disc3,
	Sparkles,
	Clock3,
} from "lucide-vue-next";

import {
	localFiles,
	addLocalFiles,
	removeLocalFile,
	loadFiles,
} from "../store/localmedia";

import { parseBlob } from "music-metadata-browser";

import {
	setPlaylist,
	play,
	pause,
	currentMedia,
	isPlaying,
} from "../store/player";

/* GLOBAL THEME */
import { currentTheme } from "../store/user";

/* ---------------- THEME ---------------- */
const theme = computed(() => currentTheme.value);

/* ---------------- FILTER CATEGORY STATE ---------------- */
const currentFilter = ref("all");

/* ---------------- LOAD FILES ---------------- */
onMounted(async () => {
	await loadFiles();
});

/* ---------------- COMPUTED FILTERED FILES ---------------- */
const filteredFiles = computed(() => {
	if (currentFilter.value === "audio") {
		return localFiles.value.filter((item) => item.type.startsWith("audio"));
	}

	if (currentFilter.value === "video") {
		return localFiles.value.filter((item) => item.type.startsWith("video"));
	}

	return localFiles.value;
});

/* ---------------- STATS ---------------- */
const totalStorage = computed(() => {
	const total = localFiles.value.reduce(
		(acc, file) => acc + (file.size || 0),
		0
	);

	return formatSize(total);
});

const audioCount = computed(
	() => localFiles.value.filter((item) => item.type.startsWith("audio")).length
);

const videoCount = computed(
	() => localFiles.value.filter((item) => item.type.startsWith("video")).length
);

/* ---------------- FORMAT SIZE ---------------- */
const formatSize = (size) => {
	if (size < 1024) return `${size} B`;

	if (size < 1024 * 1024) {
		return `${(size / 1024).toFixed(1)} KB`;
	}

	return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

/* ---------------- FILE TYPE ICON ---------------- */
const getFileTypeIcon = (type) => {
	if (type.startsWith("audio")) return Music;
	if (type.startsWith("video")) return Video;
	if (type.startsWith("image")) return ImageIcon;

	return File;
};

/* ---------------- HANDLE UPLOAD ---------------- */
const handleUpload = async (event) => {
	const uploaded = Array.from(event.target.files || []);

	if (!uploaded.length) return;

	const mapped = await Promise.all(
		uploaded.map(async (file) => {
			let genre = "Unknown";

			try {
				const metadata = await parseBlob(file);

				genre =
					metadata.common.genre?.[0] || metadata.common.style || "Unknown";
			} catch (e) {
				console.log("metadata failed");
			}

			return {
				id: crypto.randomUUID(),
				name: file.name,
				type: file.type,
				size: file.size,
				source: "local",
				genre,
				src: URL.createObjectURL(file),
				file,
			};
		})
	);

	await addLocalFiles(mapped);

	event.target.value = "";
};

/* ---------------- REMOVE ---------------- */
const removeFile = async (id) => {
	const fileToRemove = localFiles.value.find((item) => item.id === id);

	if (currentMedia.value?.id === id) {
		pause();
	}

	if (fileToRemove?.src) {
		URL.revokeObjectURL(fileToRemove.src);
	}

	await removeLocalFile(id);
};

/* ---------------- PLAY MEDIA ---------------- */
const playSong = async (media) => {
	if (!media.type.startsWith("audio") && !media.type.startsWith("video"))
		return;

	const playable = filteredFiles.value.filter(
		(item) => item.type.startsWith("audio") || item.type.startsWith("video")
	);

	const index = playable.findIndex((item) => item.id === media.id);

	if (index === -1) return;

	if (currentMedia.value?.id === media.id) {
		if (isPlaying.value) {
			pause();
		} else {
			await play();
		}

		return;
	}

	setPlaylist(playable, index);

	await play();
};

/* ---------------- HOVER PREVIEW ACTIONS ---------------- */
const handleMouseEnter = (e) => {
	const videoEl = e.currentTarget.querySelector(".preview-video");

	if (videoEl) {
		videoEl.play().catch((err) => {
			console.log("Hover preview play prevented:", err);
		});
	}
};

const handleMouseLeave = (e) => {
	const videoEl = e.currentTarget.querySelector(".preview-video");

	if (videoEl) {
		videoEl.pause();
		videoEl.currentTime = 0;
	}
};
</script>

<template>
	<div
		class="min-h-screen p-6 md:p-8 xl:p-10 font-sans transition-all duration-300"
		:class="[theme.bg, theme.text]"
	>
		<!-- HERO -->
		<section
			class="relative overflow-hidden rounded-3xl min-h-[340px] p-8 md:p-10 flex items-end border shadow-2xl mb-10"
			:class="[theme.card, theme.border]"
		>
			<div
				class="absolute inset-0 opacity-20"
				style="
					background-image: url(&quot;https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=1600&auto=format&fit=crop&quot;);
					background-size: cover;
					background-position: center;
				"
			/>

			<div
				class="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"
			/>

			<div
				class="absolute -top-24 -right-24 w-72 h-72 bg-red-500/20 blur-3xl rounded-full"
			/>

			<div
				class="absolute bottom-0 left-0 w-72 h-72 bg-orange-500/10 blur-3xl rounded-full"
			/>

			<div class="relative z-10 max-w-3xl">
				<div
					class="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-xs font-bold uppercase tracking-[0.2em] text-white/70 mb-5"
				>
					<HardDrive class="w-3.5 h-3.5" />
					Local Media System
				</div>

				<h1
					class="text-5xl md:text-6xl font-black leading-tight tracking-tight text-white"
				>
					Your Personal
					<span class="text-red-500">Media Vault</span>
				</h1>

				<p
					class="mt-5 text-sm md:text-base text-zinc-300 max-w-2xl leading-relaxed"
				>
					Upload, stream, organize, and instantly preview your local audio,
					video, and image collection in one cinematic dashboard.
				</p>

				<div class="flex flex-wrap items-center gap-4 mt-8">
					<label
						class="px-5 py-3 rounded-2xl bg-red-500 hover:bg-red-400 transition text-sm font-bold text-white flex items-center gap-2 cursor-pointer shadow-lg shadow-red-500/20"
					>
						<Upload class="w-4 h-4" />

						<span>Upload Media</span>

						<input
							type="file"
							multiple
							class="hidden"
							@change="handleUpload"
							accept="audio/*,video/*,image/*"
						/>
					</label>

					<div
						class="px-5 py-3 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md text-white/80 text-sm font-medium"
					>
						{{ localFiles.length }} Assets Stored
					</div>
				</div>
			</div>
		</section>

		<!-- QUICK STATS -->
		<section
			class="grid grid-cols-2 xl:grid-cols-4 gap-5 max-w-7xl mx-auto mb-10"
		>
			<div
				:class="[
					theme.card,
					theme.border,
					'rounded-3xl border p-5 flex items-center gap-4 shadow-sm',
				]"
			>
				<div
					class="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center"
				>
					<HardDrive class="w-6 h-6 text-red-500" />
				</div>

				<div>
					<p class="text-2xl font-black">{{ localFiles.length }}</p>

					<p class="text-xs font-medium" :class="theme.textMuted">
						Total Assets
					</p>
				</div>
			</div>

			<div
				:class="[
					theme.card,
					theme.border,
					'rounded-3xl border p-5 flex items-center gap-4 shadow-sm',
				]"
			>
				<div
					class="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center"
				>
					<Disc3 class="w-6 h-6 text-orange-500" />
				</div>

				<div>
					<p class="text-2xl font-black">{{ audioCount }}</p>

					<p class="text-xs font-medium" :class="theme.textMuted">
						Audio Tracks
					</p>
				</div>
			</div>

			<div
				:class="[
					theme.card,
					theme.border,
					'rounded-3xl border p-5 flex items-center gap-4 shadow-sm',
				]"
			>
				<div
					class="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center"
				>
					<Video class="w-6 h-6 text-purple-500" />
				</div>

				<div>
					<p class="text-2xl font-black">{{ videoCount }}</p>

					<p class="text-xs font-medium" :class="theme.textMuted">
						Video Files
					</p>
				</div>
			</div>

			<div
				:class="[
					theme.card,
					theme.border,
					'rounded-3xl border p-5 flex items-center gap-4 shadow-sm',
				]"
			>
				<div
					class="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center"
				>
					<Sparkles class="w-6 h-6 text-cyan-400" />
				</div>

				<div>
					<p class="text-2xl font-black">{{ totalStorage }}</p>

					<p class="text-xs font-medium" :class="theme.textMuted">
						Storage Usage
					</p>
				</div>
			</div>
		</section>

		<!-- HEADER -->
		<div
			class="mb-6 max-w-7xl mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-6"
		>
			<div>
				<div class="flex items-center gap-3">
					<div
						class="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center"
					>
						<Layers class="w-5 h-5 text-red-500" />
					</div>

					<div>
						<h2 class="text-3xl font-black tracking-tight">Local Collection</h2>

						<p
							class="mt-1 text-sm md:text-base transition-colors duration-300"
							:class="theme.textMuted"
						>
							Manage and instantly play your uploaded media assets.
						</p>
					</div>
				</div>
			</div>

			<div v-if="localFiles.length" class="shrink-0 flex items-center gap-3">
				<label
					:class="[
						theme.card,
						theme.border,
						theme.text,
						'flex items-center gap-2 px-5 py-3 rounded-2xl cursor-pointer text-sm font-bold transition-all duration-200 hover:scale-[1.02] shadow-sm',
					]"
				>
					<input
						type="file"
						multiple
						class="hidden"
						@change="handleUpload"
						accept="audio/*,video/*,image/*"
					/>

					<Upload class="w-4 h-4 text-red-500" />

					<span>Upload Files</span>
				</label>
			</div>
		</div>

		<!-- FILTERS -->
		<div
			v-if="localFiles.length"
			class="max-w-7xl mx-auto mb-10 flex flex-wrap gap-3"
		>
			<button
				@click="currentFilter = 'all'"
				:class="[
					currentFilter === 'all'
						? 'bg-red-500 text-white border-red-500 shadow-lg shadow-red-500/20'
						: `${theme.card} ${theme.border} ${theme.textMuted}`,
					'px-5 py-3 rounded-2xl border text-sm font-bold transition-all duration-200 flex items-center gap-2 hover:scale-[1.02]',
				]"
			>
				<Layers class="w-4 h-4" />
				All Files ({{ localFiles.length }})
			</button>

			<button
				@click="currentFilter = 'audio'"
				:class="[
					currentFilter === 'audio'
						? 'bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/20'
						: `${theme.card} ${theme.border} ${theme.textMuted}`,
					'px-5 py-3 rounded-2xl border text-sm font-bold transition-all duration-200 flex items-center gap-2 hover:scale-[1.02]',
				]"
			>
				<Music class="w-4 h-4" />
				Audio Track ({{
					localFiles.filter((f) => f.type.startsWith("audio")).length
				}})
			</button>

			<button
				@click="currentFilter = 'video'"
				:class="[
					currentFilter === 'video'
						? 'bg-purple-500 text-white border-purple-500 shadow-lg shadow-purple-500/20'
						: `${theme.card} ${theme.border} ${theme.textMuted}`,
					'px-5 py-3 rounded-2xl border text-sm font-bold transition-all duration-200 flex items-center gap-2 hover:scale-[1.02]',
				]"
			>
				<Video class="w-4 h-4" />
				Video Files ({{
					localFiles.filter((f) => f.type.startsWith("video")).length
				}})
			</button>
		</div>

		<!-- EMPTY STATE -->
		<div v-if="!localFiles.length" class="max-w-7xl mx-auto mb-12">
			<label
				:class="[
					theme.card,
					theme.border,
					'border-2 border-dashed transition-all duration-300 rounded-3xl p-14 flex flex-col items-center justify-center cursor-pointer relative overflow-hidden hover:scale-[1.01]',
				]"
			>
				<input
					type="file"
					multiple
					class="hidden"
					@change="handleUpload"
					accept="audio/*,video/*,image/*"
				/>

				<div
					class="absolute -top-20 w-60 h-60 rounded-full bg-red-500/10 blur-3xl"
				/>

				<div
					:class="[
						theme.card,
						theme.border,
						'w-16 h-16 rounded-2xl border flex items-center justify-center mb-5 transition-all duration-300 relative z-10',
					]"
				>
					<Upload class="w-6 h-6 text-red-500" />
				</div>

				<h2 class="text-xl font-black relative z-10">
					Drop your media collection here
				</h2>

				<p class="text-sm mt-2 relative z-10" :class="theme.textMuted">
					Supports Lossless Audio, HD Videos, Images, and cinematic previews.
				</p>
			</label>
		</div>

		<!-- GRID -->
		<div class="max-w-7xl mx-auto">
			<div
				v-if="filteredFiles.length"
				class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
			>
				<div
					v-for="item in filteredFiles"
					:key="item.id"
					@click="playSong(item)"
					@mouseenter="handleMouseEnter"
					@mouseleave="handleMouseLeave"
					:class="[
						theme.card,
						theme.border,
						'group rounded-3xl overflow-hidden border transition-all duration-300 cursor-pointer relative flex flex-col shadow-sm',
						currentMedia?.id === item.id
							? 'scale-[1.02] shadow-2xl ring-2 ring-red-500/20'
							: 'hover:scale-[1.015] hover:-translate-y-1',
					]"
				>
					<!-- MEDIA PREVIEW -->
					<div
						class="aspect-square overflow-hidden relative bg-black/40 flex items-center justify-center"
					>
						<!-- IMAGE -->
						<img
							v-if="item.type.startsWith('image')"
							:src="item.src"
							class="w-full h-full object-cover group-hover:scale-105 transition duration-700 ease-out"
							loading="lazy"
						/>

						<!-- VIDEO -->
						<div
							v-else-if="item.type.startsWith('video')"
							class="relative w-full h-full overflow-hidden bg-black"
						>
							<video
								:src="item.src"
								class="preview-video absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
								muted
								playsinline
								preload="metadata"
								loop
							/>
						</div>

						<!-- AUDIO -->
						<div
							v-else-if="item.type.startsWith('audio')"
							class="w-full h-full flex flex-col items-center justify-center p-4 text-center relative"
						>
							<div
								class="absolute inset-0 opacity-20"
								style="
									background-image: radial-gradient(
										circle at center,
										rgba(255, 255, 255, 0.08),
										transparent 70%
									);
								"
							/>

							<div
								:class="[
									theme.card,
									theme.border,
									'w-20 h-20 rounded-full border flex items-center justify-center mb-4 transition-all duration-500 relative z-10',
								]"
							>
								<Music class="w-8 h-8 text-red-500" />
							</div>

							<p
								class="text-[10px] uppercase tracking-[0.25em] truncate max-w-[80%] relative z-10 font-bold"
								:class="theme.textMuted"
							>
								{{ item.genre || "Unknown Genre" }}
							</p>
						</div>

						<!-- DEFAULT -->
						<div v-else class="w-full h-full flex items-center justify-center">
							<component
								:is="getFileTypeIcon(item.type)"
								class="w-12 h-12 opacity-60"
							/>
						</div>

						<!-- OVERLAY -->
						<div
							class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"
						/>

						<!-- NOW PLAYING -->
						<div
							v-if="currentMedia?.id === item.id && isPlaying"
							class="absolute top-4 left-4 px-3 py-1 rounded-full bg-green-500 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-lg"
						>
							Now Playing
						</div>

						<!-- PLAY BUTTON -->
						<button
							v-if="
								item.type.startsWith('audio') || item.type.startsWith('video')
							"
							@click.stop="playSong(item)"
							:class="[
								theme.accent,
								'absolute bottom-4 right-4 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 z-10 shadow-xl',
								currentMedia?.id === item.id && isPlaying
									? 'opacity-100'
									: 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0',
							]"
						>
							<Pause
								v-if="currentMedia?.id === item.id && isPlaying"
								class="w-5 h-5 fill-current"
							/>

							<Play v-else class="w-5 h-5 fill-current ml-0.5" />
						</button>
					</div>

					<!-- CARD BODY -->
					<div class="p-5 flex-1 flex flex-col justify-between">
						<div class="flex items-start justify-between gap-3 mb-4">
							<div class="min-w-0 flex-1">
								<p class="font-black text-sm truncate">
									{{ item.name }}
								</p>

								<p class="text-xs truncate mt-1" :class="theme.textMuted">
									{{
										item.genre && item.genre !== "Unknown"
											? item.genre
											: "Local File"
									}}
								</p>
							</div>

							<button
								@click.stop="removeFile(item.id)"
								:class="[
									theme.border,
									theme.textMuted,
									'w-9 h-9 rounded-2xl border flex items-center justify-center transition-all duration-200 shrink-0 hover:scale-105 hover:bg-red-500/10 hover:border-red-500/30',
								]"
							>
								<Trash2 class="w-4 h-4" />
							</button>
						</div>

						<div class="flex items-center justify-between gap-3">
							<div
								:class="[
									theme.card,
									theme.border,
									theme.textMuted,
									'flex items-center gap-1.5 text-[10px] font-bold w-max px-3 py-1.5 rounded-xl border uppercase tracking-wider',
								]"
							>
								<component :is="getFileTypeIcon(item.type)" class="w-3 h-3" />

								<span>
									{{ item.type.split("/")[1] || "file" }}
								</span>
							</div>

							<div
								class="flex items-center gap-1 text-[10px] font-bold"
								:class="theme.textMuted"
							>
								<Clock3 class="w-3 h-3" />

								<span>{{ formatSize(item.size) }}</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- EMPTY FILTER -->
			<div
				v-else
				:class="[
					theme.card,
					theme.border,
					theme.textMuted,
					'text-center py-32 border rounded-3xl',
				]"
			>
				<div
					class="w-14 h-14 rounded-2xl border flex items-center justify-center mx-auto mb-5"
					:class="theme.border"
				>
					<component
						:is="currentFilter === 'video' ? Video : Music"
						class="w-6 h-6"
					/>
				</div>

				<p class="text-lg font-black">
					{{
						localFiles.length
							? `No matching local ${currentFilter} assets`
							: "Your media vault is completely empty"
					}}
				</p>

				<p class="text-sm mt-2">
					{{
						localFiles.length
							? "Try changing your filter above."
							: "Upload tracks, videos, or images."
					}}
				</p>
			</div>
		</div>

		<!-- VIDEO MODAL -->
		<transition name="pop-theater">
			<div
				v-if="
					currentMedia && currentMedia.type?.startsWith('video') && isPlaying
				"
				class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 sm:p-6 md:p-10"
				@click="pause"
			>
				<div
					@click.stop
					:class="[
						theme.card,
						theme.border,
						'w-full max-w-5xl aspect-video border rounded-3xl overflow-hidden shadow-2xl flex flex-col relative bg-black',
					]"
				>
					<!-- TOP BAR -->
					<div
						class="absolute top-4 inset-x-4 z-30 flex items-center justify-between"
					>
						<div
							class="bg-black/60 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-2 max-w-[70%]"
						>
							<Video class="w-4 h-4 shrink-0" />

							<span class="text-xs font-bold truncate">
								{{ currentMedia.name }}
							</span>
						</div>

						<button
							@click="pause"
							class="w-10 h-10 rounded-2xl bg-black/60 flex items-center justify-center transition-all hover:scale-105"
						>
							<X class="w-4 h-4" />
						</button>
					</div>

					<!-- VIDEO -->
					<div
						class="flex-1 w-full h-full bg-black flex items-center justify-center"
					>
						<video
							:src="currentMedia.src"
							class="w-full h-full object-contain"
							autoplay
							controls
							playsinline
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
	transform: scale(0.98) translateY(10px);
}
</style>
```
