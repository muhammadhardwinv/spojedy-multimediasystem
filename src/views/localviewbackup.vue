<!-- @format -->

<script setup>
import {
	Upload,
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
} from "../store/localmedia";

import { parseBlob } from "music-metadata-browser";

import { setPlaylist, play, currentMedia, isPlaying } from "../store/player";

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
const handleUpload = async (event) => {
	const uploaded = Array.from(event.target.files);

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

				src: URL.createObjectURL(file),

				source: "local",

				genre,

				file,
			};
		}),
	);

	addLocalFiles(mapped);
};

/* ---------------- REMOVE ---------------- */
const removeFile = (id) => {
	const target = localFiles.value.find((f) => f.id === id);

	if (target?.src) {
		URL.revokeObjectURL(target.src);
	}

	removeLocalFile(id);
};

/* ---------------- PLAY SONG ---------------- */
const playSong = async (song) => {
	const index = localFiles.value.findIndex((s) => s.id === song.id);

	setPlaylist(localFiles.value, index);

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

		<!-- UPLOADER -->
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

		<!-- FILE LIST -->
		<div class="grid md:grid-cols-2 xl:grid-cols-3 gap-5 mt-10">
			<div
				v-for="item in localFiles"
				:key="item.id"
				@click="playSong(item)"
				class="bg-white/[0.04] border border-white/10 rounded-2xl overflow-hidden hover:border-red-500/40 transition cursor-pointer"
			>
				<!-- PREVIEW -->
				<div class="aspect-video bg-black overflow-hidden">
					<!-- IMAGE -->
					<img
						v-if="item.type.startsWith('image')"
						:src="item.src"
						class="w-full h-full object-cover"
					/>

					<!-- VIDEO -->
					<video
						v-else-if="item.type.startsWith('video')"
						:src="item.src"
						class="w-full h-full object-cover"
						controls
					/>

					<!-- AUDIO -->
					<div
						v-else-if="item.type.startsWith('audio')"
						class="w-full h-full flex flex-col items-center justify-center gap-4"
					>
						<Music
							class="w-16 h-16"
							:class="
								currentMedia?.id === item.id && isPlaying
									? 'text-red-500 animate-pulse'
									: 'text-red-400'
							"
						/>

						<button
							@click.stop="playSong(item)"
							class="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-400 transition text-sm font-medium"
						>
							{{
								currentMedia?.id === item.id && isPlaying ? "Playing" : "Play"
							}}
						</button>
					</div>

					<!-- DEFAULT -->
					<div v-else class="w-full h-full flex items-center justify-center">
						<component
							:is="getFileTypeIcon(item.type)"
							class="w-16 h-16 text-white/40"
						/>
					</div>
				</div>

				<!-- INFO -->
				<div class="p-4">
					<div class="flex items-start justify-between gap-3">
						<div class="min-w-0">
							<p class="font-medium truncate">
								{{ item.name }}
							</p>

							<p class="text-sm text-white/40 mt-1">
								{{ formatSize(item.size) }}
							</p>
						</div>

						<button
							@click.stop="removeFile(item.id)"
							class="text-white/40 hover:text-red-400 transition"
						>
							<Trash2 class="w-5 h-5" />
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
