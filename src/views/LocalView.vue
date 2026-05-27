<!-- @format -->

<script setup>
import { onMounted } from "vue";

import {
	Upload,
	Play,
	Music,
	Video,
	Image as ImageIcon,
	File,
	Trash2,
} from "lucide-vue-next";

import {
	localFiles,
	addLocalFiles,
	removeLocalFile,
	loadFiles,
} from "../store/localmedia";

import { parseBlob } from "music-metadata-browser";

import { setPlaylist, play, currentMedia, isPlaying } from "../store/player";

/* ---------------- LOAD FILES ---------------- */
onMounted(async () => {
	await loadFiles();
});

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

				file,
			};
		})
	);

	await addLocalFiles(mapped);

	event.target.value = "";
};

/* ---------------- REMOVE ---------------- */
const removeFile = async (id) => {
	await removeLocalFile(id);
};

/* ---------------- PLAY MEDIA ---------------- */
const playSong = async (media) => {
	const playable = localFiles.value.filter(
		(item) => item.type.startsWith("audio") || item.type.startsWith("video")
	);

	const index = playable.findIndex((item) => item.id === media.id);

	if (index === -1) return;

	setPlaylist(playable, index);

	document.querySelectorAll("video").forEach((v) => {
		v.pause();
	});

	await play();
};
</script>

<template>
	<div class="min-h-screen bg-black text-white p-8">
		<!-- HEADER -->
		<div class="mb-8">
			<h1 class="text-3xl font-bold">Local Files</h1>

			<p class="text-white/50 mt-2">Upload and manage your media files.</p>
		</div>

		<!-- UPLOAD -->
		<label
			class="border border-dashed border-white/20 hover:border-red-500 transition rounded-3xl p-10 flex flex-col items-center justify-center cursor-pointer bg-white/[0.03]"
		>
			<input
				type="file"
				multiple
				class="hidden"
				@change="handleUpload"
				accept="audio/*,video/*,image/*"
			/>

			<div
				class="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4"
			>
				<Upload class="w-8 h-8 text-red-400" />
			</div>

			<h2 class="text-lg font-semibold">Upload Media Files</h2>

			<p class="text-sm text-white/40 mt-1">
				Audio, video, and image supported
			</p>
		</label>

		<!-- FILES -->
		<div
			v-if="localFiles.length"
			class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-10"
		>
			<div
				v-for="item in localFiles"
				:key="item.id"
				@click="playSong(item)"
				class="group rounded-3xl overflow-hidden bg-white/[0.04] border border-white/10 hover:border-red-500/40 transition cursor-pointer"
			>
				<!-- MEDIA -->
				<div class="aspect-square overflow-hidden relative bg-black">
					<!-- IMAGE -->
					<img
						v-if="item.type.startsWith('image')"
						:src="item.src"
						class="w-full h-full object-cover group-hover:scale-105 transition duration-500"
					/>

					<!-- VIDEO -->
					<div
						v-else-if="item.type.startsWith('video')"
						class="relative w-full h-full overflow-hidden"
					>
						<video
							:src="item.src"
							class="absolute inset-0 w-full h-full object-cover"
							muted
							playsinline
							preload="metadata"
						/>
					</div>

					<!-- AUDIO -->
					<div
						v-else-if="item.type.startsWith('audio')"
						class="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-red-500/20 via-black to-black"
					>
						<Music
							class="w-24 h-24 transition"
							:class="
								currentMedia?.id === item.id && isPlaying
									? 'text-red-500 animate-pulse scale-110'
									: 'text-red-400'
							"
						/>

						<p class="mt-4 text-xs text-white/40 uppercase tracking-[0.2em]">
							{{ item.genre || "Unknown Genre" }}
						</p>
					</div>

					<!-- DEFAULT -->
					<div v-else class="w-full h-full flex items-center justify-center">
						<component
							:is="getFileTypeIcon(item.type)"
							class="w-20 h-20 text-white/30"
						/>
					</div>

					<!-- OVERLAY -->
					<div
						class="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"
					/>

					<!-- PLAY BUTTON -->
					<button
						@click.stop="playSong(item)"
						class="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-lg shadow-red-500/30"
					>
						<Music
							v-if="currentMedia?.id === item.id && isPlaying"
							class="w-5 h-5 text-white animate-pulse"
						/>

						<Play v-else class="w-5 h-5 text-white ml-0.5" />
					</button>

					<!-- PLAYING -->
					<div
						v-if="currentMedia?.id === item.id && isPlaying"
						class="absolute top-4 left-4 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 text-xs font-medium backdrop-blur"
					>
						Now Playing
					</div>
				</div>

				<!-- INFO -->
				<div class="p-5">
					<div class="flex items-start justify-between gap-3">
						<div class="min-w-0">
							<p class="font-semibold truncate">
								{{ item.name }}
							</p>

							<p class="text-sm text-white/40 truncate mt-1">
								{{ item.genre || "Unknown Genre" }}
							</p>

							<div class="flex items-center gap-2 mt-4 text-xs text-red-400">
								<Music class="w-4 h-4" />

								<span>
									{{ formatSize(item.size) }}
								</span>
							</div>
						</div>

						<button
							@click.stop="removeFile(item.id)"
							class="w-10 h-10 rounded-xl bg-white/[0.03] hover:bg-red-500/20 border border-white/5 flex items-center justify-center transition"
						>
							<Trash2 class="w-4 h-4 text-white/50 hover:text-red-400" />
						</button>
					</div>
				</div>
			</div>
		</div>

		<!-- EMPTY -->
		<div v-if="!localFiles.length" class="text-center text-white/30 py-20">
			No uploaded files yet.
		</div>
	</div>
</template>
