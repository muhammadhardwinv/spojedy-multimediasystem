<!-- @format -->

<script setup>
import { onMounted, ref, computed } from "vue";

import {
	Play,
	Pause,
	Flame,
	LoaderCircle,
	Music2,
	TrendingUp,
	Disc3,
	Headphones,
	Sparkles,
	Clock3,
} from "lucide-vue-next";

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

/* ---------------- STATE ---------------- */
const songs = ref([]);

const loading = ref(true);

/* ---------------- FETCH TRENDING ---------------- */
const fetchTrending = async () => {
	try {
		loading.value = true;

		/* 
			using multiple real music searches instead of "popular"
			so titles don't become literally "Popular"
		*/

		const keywords = [
			"top hits",
			"viral hits",
			"billboard",
			"trending music",
			"global hits",
		];

		const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];

		const response = await fetch(
			`https://itunes.apple.com/search?term=${encodeURIComponent(
				randomKeyword
			)}&media=music&limit=30`
		);

		const data = await response.json();

		/* remove duplicates */
		const uniqueSongs = [];

		const ids = new Set();

		data.results.forEach((song) => {
			if (!ids.has(song.trackId) && song.previewUrl) {
				ids.add(song.trackId);

				uniqueSongs.push({
					id: song.trackId,

					title: song.trackName,
					artist: song.artistName,

					album: song.collectionName,

					image: song.artworkUrl100?.replace("100x100", "1000x1000") || "",

					src: song.previewUrl,

					type: "audio/mp3",

					duration:
						Math.floor(Math.random() * 2) +
						2 +
						":" +
						String(Math.floor(Math.random() * 60)).padStart(2, "0"),

					plays:
						(Math.floor(Math.random() * 9) + 1).toString() +
						"." +
						Math.floor(Math.random() * 9) +
						"M",

					trending: "+" + (Math.floor(Math.random() * 80) + 20) + "%",

					source: "itunes",
				});
			}
		});

		songs.value = uniqueSongs;
	} catch (err) {
		console.error("Trending fetch failed:", err);
	} finally {
		loading.value = false;
	}
};

/* ---------------- PLAY SONG ---------------- */
const playSong = async (song) => {
	const index = songs.value.findIndex((s) => s.id === song.id);

	if (currentMedia.value?.id === song.id) {
		if (isPlaying.value) {
			pause();
		} else {
			await play();
		}

		return;
	}

	setPlaylist(songs.value, index);

	await play();
};

onMounted(fetchTrending);
</script>

<template>
	<div
		class="min-h-screen p-8 transition-all duration-300"
		:class="[theme.bg, theme.text]"
	>
		<!-- HERO -->
		<div
			:class="[
				theme.card,
				theme.border,
				'relative overflow-hidden rounded-[2rem] border p-8 mb-10',
			]"
		>
			<!-- background glow -->
			<div
				class="absolute inset-0 bg-gradient-to-br from-red-500/10 via-orange-500/5 to-transparent"
			/>

			<div class="relative z-10">
				<div
					class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8"
				>
					<!-- LEFT -->
					<div>
						<div class="flex items-center gap-4 mb-4">
							<div
								:class="[
									theme.accent,
									'w-16 h-16 rounded-3xl flex items-center justify-center shadow-2xl',
								]"
							>
								<Flame class="w-8 h-8" />
							</div>

							<div>
								<h1 class="text-4xl md:text-5xl font-black tracking-tight">
									Trending Now
								</h1>

								<p class="mt-2 text-base" :class="theme.textMuted">
									Discover what's exploding worldwide right now.
								</p>
							</div>
						</div>

						<div class="flex flex-wrap gap-3 mt-6">
							<div
								class="px-4 py-2 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-sm"
							>
								🔥 Updated Daily
							</div>

							<div
								class="px-4 py-2 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-sm"
							>
								🎧 Global Charts
							</div>

							<div
								class="px-4 py-2 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-sm"
							>
								⚡ Viral Tracks
							</div>
						</div>
					</div>

					<!-- STATS -->
					<div class="grid grid-cols-2 gap-4 min-w-[300px]">
						<div
							:class="[
								theme.cardSecondary || 'bg-white/5',
								'rounded-3xl p-5 border border-white/10 backdrop-blur-md',
							]"
						>
							<div class="flex items-center justify-between">
								<TrendingUp class="w-5 h-5 text-green-400" />

								<span class="text-xs" :class="theme.textMuted"> TODAY </span>
							</div>

							<p class="text-2xl font-bold mt-4">+42%</p>

							<p class="text-sm mt-1" :class="theme.textMuted">
								Streaming growth
							</p>
						</div>

						<div
							class="rounded-3xl p-5 border border-white/10 bg-white/5 backdrop-blur-md"
						>
							<div class="flex items-center justify-between">
								<Headphones class="w-5 h-5 text-pink-400" />

								<span class="text-xs" :class="theme.textMuted">
									LISTENERS
								</span>
							</div>

							<p class="text-2xl font-bold mt-4">12.8M</p>

							<p class="text-sm mt-1" :class="theme.textMuted">Active today</p>
						</div>

						<div
							class="rounded-3xl p-5 border border-white/10 bg-white/5 backdrop-blur-md"
						>
							<div class="flex items-center justify-between">
								<Disc3 class="w-5 h-5 text-cyan-400" />

								<span class="text-xs" :class="theme.textMuted"> TRACKS </span>
							</div>

							<p class="text-2xl font-bold mt-4">{{ songs.length }}</p>

							<p class="text-sm mt-1" :class="theme.textMuted">
								Trending songs
							</p>
						</div>

						<div
							class="rounded-3xl p-5 border border-white/10 bg-white/5 backdrop-blur-md"
						>
							<div class="flex items-center justify-b etween">
								<Sparkles class="w-5 h-5 text-yellow-400" />

								<span class="text-xs" :class="theme.textMuted"> VIBES </span>
							</div>

							<p class="text-2xl font-bold mt-4">24/7</p>

							<p class="text-sm mt-1" :class="theme.textMuted">
								Non-stop music
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- LOADING -->
		<div
			v-if="loading"
			class="flex flex-col items-center justify-center py-32"
			:class="theme.textMuted"
		>
			<LoaderCircle class="w-12 h-12 animate-spin mb-5" />

			<p class="text-lg font-medium">Loading trending tracks...</p>
		</div>

		<!-- SONG GRID -->
		<div
			v-else
			class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-7"
		>
			<div
				v-for="song in songs"
				:key="song.id"
				@click="playSong(song)"
				:class="[
					theme.card,
					theme.border,
					'group rounded-[2rem] overflow-hidden border transition-all duration-500 cursor-pointer hover:scale-[1.03] hover:-translate-y-2 relative',
					currentMedia?.id === song.id
						? `${theme.tabActive} shadow-2xl ring-2 ring-white/10`
						: 'hover:border-white/20',
				]"
			>
				<!-- IMAGE -->
				<div class="aspect-square overflow-hidden relative">
					<img
						:src="song.image"
						class="w-full h-full object-cover group-hover:scale-110 transition duration-700"
					/>

					<!-- overlays -->
					<div
						class="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"
					/>

					<div
						class="absolute inset-0 opacity-0 group-hover:opacity-100 bg-black/10 transition duration-300"
					/>

					<!-- TRENDING BADGE -->
					<div
						class="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-red-500/90 backdrop-blur-md text-white text-[11px] font-bold tracking-wide shadow-lg"
					>
						🔥 {{ song.trending }}
					</div>

					<!-- PLAY BUTTON -->
					<button
						@click.stop="playSong(song)"
						:class="[
							theme.accent,
							'absolute bottom-4 right-4 w-14 h-14 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-2xl hover:scale-110',
						]"
					>
						<Pause
							v-if="currentMedia?.id === song.id && isPlaying"
							class="w-5 h-5 fill-current"
						/>

						<Play v-else class="w-5 h-5 fill-current ml-0.5" />
					</button>

					<!-- NOW PLAYING -->
					<div
						v-if="currentMedia?.id === song.id && isPlaying"
						class="absolute bottom-4 left-4 px-3 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-[0.2em] backdrop-blur-md border border-white/10"
						:class="theme.tabActive"
					>
						Now Playing
					</div>
				</div>

				<!-- INFO -->
				<div class="p-5">
					<div class="flex items-start justify-between gap-3">
						<div class="min-w-0">
							<p class="font-bold truncate text-base leading-tight">
								{{ song.title }}
							</p>

							<p class="text-sm truncate mt-1" :class="theme.textMuted">
								{{ song.artist }}
							</p>
						</div>

						<div
							class="flex items-center gap-1 text-xs shrink-0"
							:class="theme.textMuted"
						>
							<Clock3 class="w-3.5 h-3.5" />

							<span>{{ song.duration }}</span>
						</div>
					</div>

					<!-- ALBUM -->
					<p class="text-xs mt-3 truncate opacity-70" :class="theme.textMuted">
						{{ song.album }}
					</p>

					<!-- FOOTER -->
					<div
						class="flex items-center justify-between mt-5 pt-4 border-t border-white/5"
					>
						<div
							class="flex items-center gap-2 text-xs font-medium"
							:class="theme.textMuted"
						>
							<Music2 class="w-4 h-4" />

							<span>Trending Track</span>
						</div>

						<div
							class="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/5"
						>
							{{ song.plays }} plays
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
* {
	transition:
		background-color 0.25s ease,
		border-color 0.25s ease,
		color 0.25s ease;
}
</style>
