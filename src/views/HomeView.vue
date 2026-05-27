<!-- @format -->

<script setup>
import { ref, computed, onMounted } from "vue";

import { Play, Search, Flame, Music2 } from "lucide-vue-next";

import { useRouter } from "vue-router";

import { setPlaylist, currentMedia, isPlaying } from "../store/player";

import { favorites } from "../store/favorites";

const router = useRouter();

/* SEARCH */
const search = ref("");

/* LOCAL LIBRARY */
const musics = ref([]);

/* FILTERED LOCAL */
const filtered = computed(() =>
	musics.value
		.filter((m) => m.title.toLowerCase().includes(search.value.toLowerCase()))
		.filter((m) => !m.hidden)
);

/* API STATE */
const trending = ref([]);
const upcoming = ref([]);

/* FETCH ITUNES */
const fetchAPI = async () => {
	try {
		const res = await fetch(
			"https://itunes.apple.com/search?term=pop&media=music&limit=12"
		);

		const data = await res.json();

		const mapped = data.results.map((t) => ({
			id: crypto.randomUUID(),

			title: t.trackName,
			artist: t.artistName,

			image: t.artworkUrl100?.replace("100x100", "600x600"),

			src: t.previewUrl,

			type: "audio/mp3",

			source: "itunes",

			hidden: false,
		}));

		trending.value = mapped;

		upcoming.value = [...mapped].sort(() => Math.random() - 0.5);
	} catch (err) {
		console.error("API error:", err);
	}
};

onMounted(fetchAPI);

/* MIX */
const yourMix = computed(() =>
	favorites.value.filter((f) => !f.hidden).slice(0, 8)
);

/* PLAY */
const playMusic = (music, list) => {
	if (!music || !list?.length) return;

	const index = list.findIndex((m) => m.title === music.title);

	setPlaylist(list, index >= 0 ? index : 0);

	router.push("/player");
};

const playTrending = () => {
	if (!trending.value.length) return;

	setPlaylist(trending.value, 0);

	router.push("/player");
};
</script>

<template>
	<div class="p-8 space-y-14 text-white">
		<!-- HERO -->
		<section
			class="relative overflow-hidden rounded-3xl min-h-[420px] p-10 flex items-end border border-white/10 bg-gradient-to-br from-[#7F1D1D]/30 via-black to-black"
		>
			<div
				class="absolute inset-0 opacity-30"
				style="
					background-image: url(&quot;https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4&quot;);
					background-size: cover;
					background-position: center;
				"
			/>

			<div class="absolute inset-0 bg-black/60" />

			<div class="relative z-10 max-w-2xl space-y-4">
				<h1 class="text-6xl font-black leading-tight">
					Discover
					<span class="text-red-500"> Iconic Sounds </span>
				</h1>

				<p class="text-white/60 text-lg">
					Trending music, curated mixes, and cinematic audio experience.
				</p>

				<button
					@click="playTrending"
					class="mt-4 px-6 py-3 bg-red-500 rounded-2xl font-semibold hover:bg-red-400 transition shadow-lg shadow-red-500/30"
				>
					▶ Play Trending
				</button>
			</div>
		</section>

		<!-- SEARCH -->
		<div
			class="flex items-center gap-3 bg-white/[0.04] border border-white/10 p-4 rounded-2xl"
		>
			<Search class="w-5 h-5 text-white/40" />

			<input
				v-model="search"
				placeholder="Search tracks..."
				class="bg-transparent w-full outline-none placeholder:text-white/30"
			/>
		</div>

		<!-- LIBRARY -->
		<section class="space-y-6">
			<div class="flex items-center gap-3">
				<div
					class="w-14 h-14 rounded-2xl bg-red-500/20 flex items-center justify-center"
				>
					<Music2 class="w-7 h-7 text-red-400" />
				</div>

				<div>
					<h2 class="text-3xl font-bold">Library</h2>

					<p class="text-white/40">Your personal collection.</p>
				</div>
			</div>

			<div class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				<div
					v-for="music in filtered"
					:key="music.title"
					@click="playMusic(music, filtered)"
					class="group rounded-3xl overflow-hidden bg-white/[0.04] border border-white/10 hover:border-red-500/40 transition cursor-pointer"
				>
					<div class="aspect-square overflow-hidden relative">
						<img
							:src="music.image"
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

						<div
							v-if="currentMedia?.title === music.title && isPlaying"
							class="absolute top-4 left-4 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-xs text-green-400 backdrop-blur-md"
						>
							Now Playing
						</div>
					</div>

					<div class="p-5">
						<p class="font-semibold truncate">
							{{ music.title }}
						</p>

						<p class="text-sm text-white/40 truncate mt-1">
							{{ music.artist }}
						</p>

						<div class="flex items-center gap-2 mt-4 text-xs text-red-400">
							<Music2 class="w-4 h-4" />

							<span> Local Library </span>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- TRENDING -->
		<section class="space-y-6">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-3">
					<div
						class="w-14 h-14 rounded-2xl bg-red-500/20 flex items-center justify-center"
					>
						<Flame class="w-7 h-7 text-red-400" />
					</div>

					<div>
						<h2 class="text-3xl font-bold">Trending</h2>

						<p class="text-white/40">Most popular tracks right now.</p>
					</div>
				</div>

				<button
					@click="playTrending"
					class="px-5 py-3 rounded-2xl bg-red-500 hover:bg-red-400 transition font-medium"
				>
					Play All
				</button>
			</div>

			<div class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				<div
					v-for="item in trending.filter((m) => !m.hidden)"
					:key="item.title"
					@click="playMusic(item, trending)"
					class="group rounded-3xl overflow-hidden bg-white/[0.04] border border-white/10 hover:border-red-500/40 transition cursor-pointer"
				>
					<div class="aspect-square overflow-hidden relative">
						<img
							:src="item.image"
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

						<div
							v-if="currentMedia?.title === item.title && isPlaying"
							class="absolute top-4 left-4 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-xs text-green-400 backdrop-blur-md"
						>
							Now Playing
						</div>
					</div>

					<div class="p-5">
						<p class="font-semibold truncate">
							{{ item.title }}
						</p>

						<p class="text-sm text-white/40 truncate mt-1">
							{{ item.artist }}
						</p>

						<div class="flex items-center gap-2 mt-4 text-xs text-red-400">
							<Music2 class="w-4 h-4" />

							<span> Trending Preview </span>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- YOUR MIX -->
		<section class="space-y-6">
			<div class="flex items-center gap-3">
				<div
					class="w-14 h-14 rounded-2xl bg-pink-500/20 flex items-center justify-center"
				>
					<Music2 class="w-7 h-7 text-pink-400" />
				</div>

				<div>
					<h2 class="text-3xl font-bold">Your Mix</h2>

					<p class="text-white/40">Based on your favorites.</p>
				</div>
			</div>

			<div class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				<div
					v-for="item in yourMix"
					:key="item.title"
					@click="playMusic(item, yourMix)"
					class="group rounded-3xl overflow-hidden bg-white/[0.04] border border-white/10 hover:border-pink-500/40 transition cursor-pointer"
				>
					<div class="aspect-square overflow-hidden relative">
						<img
							:src="item.image"
							class="w-full h-full object-cover group-hover:scale-105 transition duration-500"
						/>

						<div
							class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"
						/>

						<button
							class="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-pink-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-lg shadow-pink-500/30"
						>
							<Play class="w-6 h-6 text-white ml-1" />
						</button>
					</div>

					<div class="p-5">
						<p class="font-semibold truncate">
							{{ item.title }}
						</p>

						<p class="text-sm text-white/40 truncate mt-1">
							{{ item.artist }}
						</p>

						<div class="flex items-center gap-2 mt-4 text-xs text-pink-400">
							<Music2 class="w-4 h-4" />

							<span> Favorite Mix </span>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- UPCOMING -->
		<section class="space-y-6">
			<div class="flex items-center gap-3">
				<div
					class="w-14 h-14 rounded-2xl bg-purple-500/20 flex items-center justify-center"
				>
					<Music2 class="w-7 h-7 text-purple-400" />
				</div>

				<div>
					<h2 class="text-3xl font-bold">Upcoming</h2>

					<p class="text-white/40">Next tracks you may enjoy.</p>
				</div>
			</div>

			<div class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				<div
					v-for="item in upcoming.filter((m) => !m.hidden)"
					:key="item.title"
					@click="playMusic(item, upcoming)"
					class="group rounded-3xl overflow-hidden bg-white/[0.04] border border-white/10 hover:border-purple-500/40 transition cursor-pointer"
				>
					<div class="aspect-square overflow-hidden relative">
						<img
							:src="item.image"
							class="w-full h-full object-cover group-hover:scale-105 transition duration-500"
						/>

						<div
							class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"
						/>

						<button
							class="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-lg shadow-purple-500/30"
						>
							<Play class="w-6 h-6 text-white ml-1" />
						</button>

						<div
							v-if="currentMedia?.title === item.title && isPlaying"
							class="absolute top-4 left-4 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-xs text-green-400 backdrop-blur-md"
						>
							Now Playing
						</div>
					</div>

					<div class="p-5">
						<p class="font-semibold truncate">
							{{ item.title }}
						</p>

						<p class="text-sm text-white/40 truncate mt-1">
							{{ item.artist }}
						</p>

						<div class="flex items-center gap-2 mt-4 text-xs text-purple-400">
							<Music2 class="w-4 h-4" />

							<span> Upcoming Queue </span>
						</div>
					</div>
				</div>
			</div>
		</section>
	</div>
</template>
