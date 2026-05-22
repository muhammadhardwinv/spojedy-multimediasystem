<!-- @format -->

<script setup>
import { onMounted, ref } from "vue";

import { Play, Flame, LoaderCircle, Music2 } from "lucide-vue-next";

import { setPlaylist, play, currentMedia, isPlaying } from "../store/player";

/* ---------------- STATE ---------------- */
const songs = ref([]);

const loading = ref(true);

/* ---------------- FETCH TRENDING ---------------- */
const fetchTrending = async () => {
	try {
		const response = await fetch(
			"https://itunes.apple.com/search?term=popular&media=music&limit=20",
		);

		const data = await response.json();

		songs.value = data.results.map((song) => ({
			id: song.trackId,

			title: song.trackName,
			artist: song.artistName,

			image: song.artworkUrl100?.replace("100x100", "600x600") || "",

			src: song.previewUrl,

			type: "audio/mp3",

			source: "itunes",
		}));
	} catch (err) {
		console.error("Trending fetch failed:", err);
	} finally {
		loading.value = false;
	}
};

/* ---------------- PLAY SONG ---------------- */
const playSong = async (song) => {
	const index = songs.value.findIndex((s) => s.id === song.id);

	setPlaylist(songs.value, index);

	await play();
};

onMounted(fetchTrending);
</script>

<template>
	<div class="min-h-screen bg-black text-white p-8">
		<!-- HEADER -->
		<div class="flex items-center gap-3 mb-8">
			<div
				class="w-14 h-14 rounded-2xl bg-red-500/20 flex items-center justify-center"
			>
				<Flame class="w-7 h-7 text-red-400" />
			</div>

			<div>
				<h1 class="text-3xl font-bold">Trending</h1>

				<p class="text-white/40">Most popular tracks right now.</p>
			</div>
		</div>

		<!-- LOADING -->
		<div
			v-if="loading"
			class="flex flex-col items-center justify-center py-24 text-white/40"
		>
			<LoaderCircle class="w-10 h-10 animate-spin mb-4" />

			<p>Loading trending songs...</p>
		</div>

		<!-- GRID -->
		<div v-else class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
			<div
				v-for="song in songs"
				:key="song.id"
				@click="playSong(song)"
				class="group rounded-3xl overflow-hidden bg-white/[0.04] border border-white/10 hover:border-red-500/40 transition cursor-pointer"
			>
				<!-- IMAGE -->
				<div class="aspect-square overflow-hidden relative">
					<img
						:src="song.image"
						class="w-full h-full object-cover group-hover:scale-105 transition duration-500"
					/>

					<div
						class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"
					/>

					<button
						class="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-lg shadow-red-500/30"
					>
						<Play class="w-6 h-6 text-white ml-1" />
					</button>
				</div>

				<!-- INFO -->
				<div class="p-5">
					<p class="font-semibold truncate">
						{{ song.title }}
					</p>

					<p class="text-sm text-white/40 truncate mt-1">
						{{ song.artist }}
					</p>

					<div class="flex items-center gap-2 mt-4 text-xs text-red-400">
						<Music2 class="w-4 h-4" />

						<span> Trending Preview </span>
					</div>

					<!-- ACTIVE -->
					<div
						v-if="currentMedia?.id === song.id && isPlaying"
						class="mt-4 text-xs text-green-400"
					>
						Now Playing
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
