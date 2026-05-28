<!-- @format -->

<script setup>
import { ref, computed, onMounted } from "vue";

import {
	Search,
	Music2,
	Video,
	Play,
	Pause,
	LoaderCircle,
	TrendingUp,
	Disc3,
	Headphones,
	Flame,
	Sparkles,
	X,
} from "lucide-vue-next";

import { currentTheme } from "../store/user";

import {
	setPlaylist,
	play,
	pause,
	currentMedia,
	isPlaying,
} from "../store/player";

/* ---------------- GLOBAL THEME ---------------- */
const theme = computed(() => currentTheme.value);

/* ---------------- STATE ---------------- */
const query = ref("");

const loading = ref(false);

const activeFilter = ref("all");

const results = ref([]);

const recentSearches = ref([
	"Synthwave",
	"The Weeknd",
	"Lo-fi Chill",
	"Cyberpunk",
	"Drake",
]);

/* ---------------- TRENDING KEYWORDS ---------------- */
const trendingKeywords = [
	"Pop",
	"EDM",
	"Night Drive",
	"Jazz",
	"Hip Hop",
	"Rock",
	"Ambient",
	"Anime OST",
];

/* ---------------- FETCH SEARCH ---------------- */
const searchMedia = async () => {
	if (!query.value.trim()) {
		results.value = [];
		return;
	}

	loading.value = true;

	try {
		const response = await fetch(
			`https://itunes.apple.com/search?term=${encodeURIComponent(
				query.value
			)}&media=music&limit=30`
		);

		const data = await response.json();

		results.value = data.results.map((item) => ({
			id: item.trackId,

			title: item.trackName,

			artist: item.artistName,

			image: item.artworkUrl100?.replace("100x100", "800x800") || "",

			src: item.previewUrl,

			type: "audio/mp3",

			album: item.collectionName,

			source: "itunes",
		}));

		/* Save recent search */
		if (!recentSearches.value.includes(query.value)) {
			recentSearches.value.unshift(query.value);

			if (recentSearches.value.length > 8) {
				recentSearches.value.pop();
			}
		}
	} catch (err) {
		console.error("Search failed:", err);
	} finally {
		loading.value = false;
	}
};

/* ---------------- FILTERED RESULTS ---------------- */
const filteredResults = computed(() => {
	if (activeFilter.value === "audio") {
		return results.value.filter((r) => r.type.startsWith("audio"));
	}

	if (activeFilter.value === "video") {
		return results.value.filter((r) => r.type.startsWith("video"));
	}

	return results.value;
});

/* ---------------- PLAY ---------------- */
const playSong = async (song) => {
	const playable = filteredResults.value;

	const index = playable.findIndex((s) => s.id === song.id);

	setPlaylist(playable, index);

	await play();
};

/* ---------------- TOGGLE PLAY ---------------- */
const toggleTrack = async (song) => {
	if (currentMedia.value?.id === song.id) {
		if (isPlaying.value) {
			pause();
		} else {
			await play();
		}

		return;
	}

	await playSong(song);
};

/* ---------------- QUICK SEARCH ---------------- */
const quickSearch = async (term) => {
	query.value = term;

	await searchMedia();
};

/* ---------------- ENTER SEARCH ---------------- */
const onEnter = async () => {
	await searchMedia();
};

/* ---------------- INITIAL TRENDING ---------------- */
onMounted(async () => {
	query.value = "Trending";

	await searchMedia();
});
</script>

<template>
	<div
		class="min-h-screen p-6 md:p-8 transition-colors duration-500"
		:class="[theme.bg, theme.text]"
	>
		<div class="max-w-7xl mx-auto">
			<!-- HERO -->
			<div
				class="rounded-[32px] border p-8 md:p-10 overflow-hidden relative transition-all duration-500"
				:class="[theme.card, theme.border]"
			>
				<div
					class="absolute inset-0 opacity-40 pointer-events-none"
					:class="
						theme.id === 'cyber'
							? 'bg-gradient-to-br from-cyan-500/10 via-fuchsia-500/10 to-transparent'
							: theme.id === 'royal'
								? 'bg-gradient-to-br from-violet-500/10 via-fuchsia-500/5 to-transparent'
								: 'bg-gradient-to-br from-red-500/10 via-transparent to-transparent'
					"
				/>

				<div class="relative z-10">
					<div class="flex items-center gap-4">
						<div
							class="w-16 h-16 rounded-3xl flex items-center justify-center border"
							:class="[theme.card, theme.border]"
						>
							<Search
								class="w-8 h-8"
								:class="theme.id === 'light' ? 'text-zinc-900' : 'text-red-400'"
							/>
						</div>

						<div>
							<h1 class="text-4xl md:text-5xl font-black tracking-tight">
								Search
							</h1>

							<p class="mt-2 text-sm md:text-base" :class="theme.textMuted">
								Discover music, artists, albums, and streaming previews
								instantly.
							</p>
						</div>
					</div>

					<!-- SEARCH BAR -->
					<div class="mt-8 flex flex-col md:flex-row gap-4">
						<div class="relative flex-1">
							<Search
								class="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5"
								:class="theme.textMuted"
							/>

							<input
								v-model="query"
								@keyup.enter="onEnter"
								type="text"
								placeholder="Search songs, artists, albums..."
								class="w-full h-14 rounded-2xl border pl-14 pr-5 outline-none transition-all duration-300"
								:class="[theme.card, theme.border, theme.text]"
							/>
						</div>

						<button
							@click="searchMedia"
							class="h-14 px-8 rounded-2xl font-semibold transition-all duration-300 hover:scale-[1.02]"
							:class="theme.accent"
						>
							Search
						</button>
					</div>

					<!-- QUICK TAGS -->
					<div class="mt-6 flex flex-wrap gap-3">
						<button
							v-for="tag in trendingKeywords"
							:key="tag"
							@click="quickSearch(tag)"
							class="px-4 py-2 rounded-full border text-sm transition-all duration-300 hover:scale-105"
							:class="[theme.card, theme.border]"
						>
							# {{ tag }}
						</button>
					</div>
				</div>
			</div>

			<!-- FILTERS -->
			<div class="mt-8 flex items-center gap-3 overflow-x-auto pb-2">
				<button
					@click="activeFilter = 'all'"
					class="px-5 py-3 rounded-2xl border text-sm font-medium transition-all"
					:class="
						activeFilter === 'all'
							? theme.tabActive
							: `${theme.card} ${theme.border}`
					"
				>
					All Results
				</button>

				<button
					@click="activeFilter = 'audio'"
					class="px-5 py-3 rounded-2xl border text-sm font-medium transition-all flex items-center gap-2"
					:class="
						activeFilter === 'audio'
							? theme.tabActive
							: `${theme.card} ${theme.border}`
					"
				>
					<Music2 class="w-4 h-4" />
					Audio
				</button>

				<button
					@click="activeFilter = 'video'"
					class="px-5 py-3 rounded-2xl border text-sm font-medium transition-all flex items-center gap-2"
					:class="
						activeFilter === 'video'
							? theme.tabActive
							: `${theme.card} ${theme.border}`
					"
				>
					<Video class="w-4 h-4" />
					Video
				</button>
			</div>

			<!-- RECENTS -->
			<div v-if="recentSearches.length" class="mt-8">
				<div class="flex items-center gap-3 mb-4">
					<TrendingUp class="w-5 h-5 text-red-400" />

					<h2 class="text-xl font-bold">Recent Searches</h2>
				</div>

				<div class="flex flex-wrap gap-3">
					<button
						v-for="item in recentSearches"
						:key="item"
						@click="quickSearch(item)"
						class="px-4 py-2 rounded-xl border text-sm transition-all duration-300 hover:scale-105 flex items-center gap-2"
						:class="[theme.card, theme.border]"
					>
						<Headphones class="w-4 h-4" />
						{{ item }}
					</button>
				</div>
			</div>

			<!-- LOADING -->
			<div
				v-if="loading"
				class="py-28 flex flex-col items-center justify-center"
			>
				<LoaderCircle class="w-12 h-12 animate-spin mb-5 text-red-400" />

				<p :class="theme.textMuted">Searching media universe...</p>
			</div>

			<!-- RESULTS -->
			<div
				v-else-if="filteredResults.length"
				class="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
			>
				<div
					v-for="song in filteredResults"
					:key="song.id"
					class="group rounded-[28px] overflow-hidden border transition-all duration-500 cursor-pointer hover:scale-[1.02]"
					:class="[theme.card, theme.border]"
					@click="toggleTrack(song)"
				>
					<!-- COVER -->
					<div class="aspect-square overflow-hidden relative">
						<img
							:src="song.image"
							class="w-full h-full object-cover transition duration-700 group-hover:scale-110"
						/>

						<div
							class="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"
						/>

						<button
							class="absolute bottom-4 right-4 w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all duration-300"
							:class="
								currentMedia?.id === song.id && isPlaying
									? 'opacity-100 scale-100 bg-red-500'
									: 'opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 bg-red-500'
							"
						>
							<Pause
								v-if="currentMedia?.id === song.id && isPlaying"
								class="w-6 h-6 text-white"
							/>

							<Play v-else class="w-6 h-6 text-white ml-1" />
						</button>

						<div
							v-if="currentMedia?.id === song.id && isPlaying"
							class="absolute top-4 left-4 px-3 py-1 rounded-full text-xs border backdrop-blur-md bg-green-500/10 border-green-500/30 text-green-400"
						>
							Now Playing
						</div>
					</div>

					<!-- INFO -->
					<div class="p-5">
						<h3 class="font-bold truncate text-lg">
							{{ song.title }}
						</h3>

						<p class="mt-1 truncate text-sm" :class="theme.textMuted">
							{{ song.artist }}
						</p>

						<p class="mt-3 text-xs truncate" :class="theme.textMuted">
							{{ song.album }}
						</p>

						<div class="mt-5 flex items-center justify-between">
							<div
								class="flex items-center gap-2 text-xs"
								:class="theme.textMuted"
							>
								<Disc3 class="w-4 h-4" />

								<span>Preview Track</span>
							</div>

							<div
								class="px-3 py-1 rounded-full text-xs border"
								:class="[theme.card, theme.border]"
							>
								iTunes
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- EMPTY -->
			<div
				v-else
				class="py-28 flex flex-col items-center justify-center text-center"
			>
				<div
					class="w-24 h-24 rounded-full flex items-center justify-center border mb-6"
					:class="[theme.card, theme.border]"
				>
					<Sparkles class="w-10 h-10" :class="theme.textMuted" />
				</div>

				<h2 class="text-2xl font-bold">No results found</h2>

				<p class="mt-3 max-w-md text-sm" :class="theme.textMuted">
					Try searching with another keyword, artist name, or genre to explore
					more music recommendations.
				</p>

				<button
					@click="
						query = '';
						results = [];
					"
					class="mt-6 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 flex items-center gap-2"
					:class="theme.accent"
				>
					<X class="w-4 h-4" />
					Clear Search
				</button>
			</div>

			<!-- DISCOVER -->
			<div class="mt-16">
				<div class="flex items-center gap-3 mb-6">
					<div
						class="w-12 h-12 rounded-2xl flex items-center justify-center"
						:class="theme.card"
					>
						<Flame class="w-6 h-6 text-red-400" />
					</div>

					<div>
						<h2 class="text-2xl font-bold">Discover More</h2>

						<p class="text-sm" :class="theme.textMuted">
							Explore trending vibes and genres
						</p>
					</div>
				</div>

				<div class="grid md:grid-cols-3 gap-5">
					<div
						class="rounded-[28px] p-6 border transition-all duration-300 hover:scale-[1.02]"
						:class="[theme.card, theme.border]"
					>
						<div
							class="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center mb-5"
						>
							<Music2 class="w-7 h-7 text-red-400" />
						</div>

						<h3 class="text-xl font-bold">Daily Mixes</h3>

						<p class="mt-2 text-sm" :class="theme.textMuted">
							Auto-generated playlists based on your listening mood.
						</p>
					</div>

					<div
						class="rounded-[28px] p-6 border transition-all duration-300 hover:scale-[1.02]"
						:class="[theme.card, theme.border]"
					>
						<div
							class="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center mb-5"
						>
							<Headphones class="w-7 h-7 text-red-400" />
						</div>

						<h3 class="text-xl font-bold">Audio Experience</h3>

						<p class="mt-2 text-sm" :class="theme.textMuted">
							Immersive playback with your personalized visual themes.
						</p>
					</div>

					<div
						class="rounded-[28px] p-6 border transition-all duration-300 hover:scale-[1.02]"
						:class="[theme.card, theme.border]"
					>
						<div
							class="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center mb-5"
						>
							<Video class="w-7 h-7 text-red-400" />
						</div>

						<h3 class="text-xl font-bold">Video Streaming</h3>

						<p class="mt-2 text-sm" :class="theme.textMuted">
							Stream videos seamlessly with cinematic theater mode support.
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
