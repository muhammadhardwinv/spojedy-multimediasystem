<!-- @format -->

<script setup>
import { ref, computed, onMounted } from "vue";
import { Play, Search, Flame, Music2, Upload } from "lucide-vue-next";
import { useRouter } from "vue-router";
import { currentTheme } from "../store/user";
import { setPlaylist, currentMedia, isPlaying } from "../store/player";
import { favorites } from "../store/favorites";
import { localFiles, addLocalFiles, loadFiles } from "../store/localmedia";
import { parseBlob } from "music-metadata-browser";

const router = useRouter();
const search = ref("");

const filtered = computed(() => {
	return localFiles.value
		.filter((m) => m.type?.startsWith("audio"))
		.filter((m) =>
			(m.name || m.title || "")
				.toLowerCase()
				.includes(search.value.toLowerCase())
		);
});

const trending = ref([]);
const upcoming = ref([]);

const fetchAPI = async () => {
	try {
		await loadFiles();
	} catch (err) {
		console.error("Failed to load local media store data:", err);
	}

	try {
		const res = await fetch(
			"https://itunes.apple.com/search?term=pop&media=music&limit=12"
		);
		const data = await res.json();
		trending.value = data.results.map((t) => ({
			id: crypto.randomUUID(),
			title: t.trackName,
			artist: t.artistName,
			image: t.artworkUrl100?.replace("100x100", "600x600"),
			src: t.previewUrl,
			type: "audio/mp3",
			source: "itunes",
			hidden: false,
		}));
		upcoming.value = [...trending.value].sort(() => Math.random() - 0.5);
	} catch (err) {
		console.error("API error:", err);
	}
};

onMounted(fetchAPI);

const yourMix = computed(() =>
	favorites.value.filter((f) => !f.hidden).slice(0, 8)
);

const playMusic = (music, list) => {
	if (!music || !list?.length) return;
	const index = list.findIndex(
		(m) => m.id === music.id || m.title === music.title || m.name === music.name
	);
	setPlaylist(list, index >= 0 ? index : 0);
	router.push("/player");
};

const playTrending = () => {
	if (!trending.value.length) return;
	setPlaylist(trending.value, 0);
	router.push("/player");
};

const handleLocalUpload = async (event) => {
	const files = Array.from(event.target.files || []);
	if (!files.length) return;

	const mapped = await Promise.all(
		files.map(async (file) => {
			let genre = "Unknown";
			let pictureUrl = null;
			let artist = "Unknown Artist";
			let title = file.name.replace(/\.[^/.]+$/, "");

			try {
				const metadata = await parseBlob(file);
				genre =
					metadata.common.genre?.[0] || metadata.common.style || "Unknown";
				artist =
					metadata.common.artist ||
					metadata.common.albumartist ||
					"Unknown Artist";
				title = metadata.common.title || title;

				if (metadata.common.picture?.length) {
					const pic = metadata.common.picture[0];
					const blob = new Blob([new Uint8Array(pic.data)], {
						type: pic.format,
					});
					pictureUrl = URL.createObjectURL(blob);
				}
			} catch (e) {
				console.warn("Metadata parse failed:", e);
			}

			// Fallback if no art found
			if (!pictureUrl) {
				const char = title.slice(0, 1).toUpperCase();
				pictureUrl = `https://ui-avatars.com/api/?name=${char}&background=random&size=600`;
			}

			return {
				id: crypto.randomUUID(),
				title,
				name: file.name,
				type: file.type,
				size: file.size,
				artist,
				image: pictureUrl,
				source: "local",
				genre,
				src: URL.createObjectURL(file), // Note: Remember to revoke this on component unmount
				file,
			};
		})
	);

	await addLocalFiles(mapped);
	event.target.value = "";
};
</script>

<template>
	<div class="p-8 space-y-14">
		<!-- HERO BANNER PANEL -->
		<section
			class="relative overflow-hidden rounded-3xl min-h-[380px] p-10 flex items-end border bg-zinc-950 shadow-2xl"
			:class="currentTheme.border"
		>
			<div
				class="absolute inset-0 opacity-25 mix-blend-luminosity"
				style="
					background-image: url(&quot;https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4&quot;);
					background-size: cover;
					background-position: center;
				"
			/>
			<div
				class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"
			/>

			<div class="relative z-10 max-w-2xl space-y-4 text-white">
				<h1
					class="text-5xl md:text-6xl font-black leading-tight tracking-tight"
				>
					Discover <span class="text-red-500">Iconic Sounds</span>
				</h1>
				<p class="text-zinc-300 text-base md:text-lg font-medium opacity-90">
					Trending music, curated mixes, and cinematic audio experiences.
				</p>
				<button
					@click="playTrending"
					class="mt-2 px-6 py-3 text-sm font-bold bg-red-500 hover:bg-red-400 rounded-2xl flex items-center gap-2 transition shadow-lg shadow-red-500/20"
				>
					<Play class="w-4 h-4 fill-current" /> Play Trending
				</button>
			</div>
		</section>

		<!-- FLOATING SEARCH BAR -->
		<div
			class="flex items-center gap-3 border p-4 rounded-2xl backdrop-blur-md shadow-sm transition"
			:class="[currentTheme.card, currentTheme.border]"
		>
			<Search class="w-5 h-5 opacity-40" />
			<input
				v-model="search"
				placeholder="Search tracks..."
				class="bg-transparent w-full text-sm font-medium outline-none placeholder:opacity-30 focus:outline-none"
			/>
		</div>

		<!-- TRENDING SECTION -->
		<section class="space-y-6">
			<div class="flex items-center justify-between flex-wrap gap-4">
				<div class="flex items-center gap-3">
					<div
						class="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20"
					>
						<Flame class="w-5 h-5 text-orange-500" />
					</div>
					<div>
						<h2 class="text-2xl font-black tracking-tight">Trending</h2>
						<p class="text-xs font-medium" :class="currentTheme.textMuted">
							Most popular tracking data feeds right now.
						</p>
					</div>
				</div>
				<button
					@click="playTrending"
					class="px-4 py-2.5 text-xs font-bold bg-orange-500 text-white rounded-xl shadow-md shadow-orange-500/10 hover:bg-orange-400 transition"
				>
					Play All
				</button>
			</div>

			<div class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				<div
					v-for="item in trending.filter((m) => !m.hidden)"
					:key="item.title"
					@click="playMusic(item, trending)"
					class="group rounded-2xl overflow-hidden border transition cursor-pointer flex flex-col shadow-sm"
					:class="[
						currentTheme.card,
						currentTheme.border,
						'hover:scale-[1.01]',
					]"
				>
					<div class="aspect-square overflow-hidden relative bg-zinc-500/10">
						<img
							:src="item.image"
							class="w-full h-full object-cover group-hover:scale-105 transition duration-500"
							alt="Cover art"
						/>
						<div
							class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300"
						/>
						<button
							class="absolute bottom-4 right-4 w-11 h-11 rounded-full bg-orange-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-md shadow-orange-500/30"
						>
							<Play class="w-5 h-5 fill-current ml-0.5" />
						</button>
						<div
							v-if="currentMedia?.title === item.title && isPlaying"
							class="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-green-500 text-white text-[10px] font-bold shadow-md"
						>
							Now Playing
						</div>
					</div>
					<div class="p-4 flex-1 flex flex-col justify-between">
						<div>
							<p class="font-bold truncate text-sm">{{ item.title }}</p>
							<p
								class="text-xs truncate mt-0.5"
								:class="currentTheme.textMuted"
							>
								{{ item.artist }}
							</p>
						</div>
						<div
							class="flex items-center gap-1.5 mt-4 text-[10px] font-bold text-orange-500 uppercase tracking-wider"
						>
							<Flame class="w-3.5 h-3.5" /> <span>Trending Preview</span>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- UPCOMING RECOMMENDATIONS SECTION -->
		<section class="space-y-6">
			<div class="flex items-center gap-3">
				<div
					class="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20"
				>
					<Music2 class="w-5 h-5 text-purple-500" />
				</div>
				<div>
					<h2 class="text-2xl font-black tracking-tight">Upcoming</h2>
					<p class="text-xs font-medium" :class="currentTheme.textMuted">
						Fresh recommendations queued for discovery.
					</p>
				</div>
			</div>

			<div class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				<div
					v-for="item in upcoming.filter((m) => !m.hidden)"
					:key="item.title"
					@click="playMusic(item, upcoming)"
					class="group rounded-2xl overflow-hidden border transition cursor-pointer flex flex-col shadow-sm"
					:class="[
						currentTheme.card,
						currentTheme.border,
						'hover:scale-[1.01]',
					]"
				>
					<div class="aspect-square overflow-hidden relative bg-zinc-500/10">
						<img
							:src="item.image"
							class="w-full h-full object-cover group-hover:scale-105 transition duration-500"
							alt="Cover art"
						/>
						<div
							class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300"
						/>
						<button
							class="absolute bottom-4 right-4 w-11 h-11 rounded-full bg-purple-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-md shadow-purple-500/30"
						>
							<Play class="w-5 h-5 fill-current ml-0.5" />
						</button>
						<div
							v-if="currentMedia?.title === item.title && isPlaying"
							class="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-green-500 text-white text-[10px] font-bold shadow-md"
						>
							Now Playing
						</div>
					</div>
					<div class="p-4 flex-1 flex flex-col justify-between">
						<div>
							<p class="font-bold truncate text-sm">{{ item.title }}</p>
							<p
								class="text-xs truncate mt-0.5"
								:class="currentTheme.textMuted"
							>
								{{ item.artist }}
							</p>
						</div>
						<div
							class="flex items-center gap-1.5 mt-4 text-[10px] font-bold text-purple-500 uppercase tracking-wider"
						>
							<Music2 class="w-3.5 h-3.5" /> <span>Upcoming Queue</span>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- CUSTOM MIX SECTION -->
		<section class="space-y-6">
			<div class="flex items-center gap-3">
				<div
					class="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center border border-pink-500/20"
				>
					<Music2 class="w-5 h-5 text-pink-500" />
				</div>
				<div>
					<h2 class="text-2xl font-black tracking-tight">Your Mix</h2>
					<p class="text-xs font-medium" :class="currentTheme.textMuted">
						Generated algorithmically from your favorites.
					</p>
				</div>
			</div>

			<div class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				<div
					v-for="item in yourMix"
					:key="item.title"
					@click="playMusic(item, yourMix)"
					class="group rounded-2xl overflow-hidden border transition cursor-pointer flex flex-col shadow-sm"
					:class="[
						currentTheme.card,
						currentTheme.border,
						'hover:scale-[1.01]',
					]"
				>
					<div class="aspect-square overflow-hidden relative bg-zinc-500/10">
						<img
							:src="item.image"
							class="w-full h-full object-cover group-hover:scale-105 transition duration-500"
							alt="Cover art"
						/>
						<div
							class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300"
						/>
						<button
							class="absolute bottom-4 right-4 w-11 h-11 rounded-full bg-pink-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-md shadow-pink-500/30"
						>
							<Play class="w-5 h-5 fill-current ml-0.5" />
						</button>
					</div>
					<div class="p-4 flex-1 flex flex-col justify-between">
						<div>
							<p class="font-bold truncate text-sm">{{ item.title }}</p>
							<p
								class="text-xs truncate mt-0.5"
								:class="currentTheme.textMuted"
							>
								{{ item.artist }}
							</p>
						</div>
						<div
							class="flex items-center gap-1.5 mt-4 text-[10px] font-bold text-pink-500 uppercase tracking-wider"
						>
							<Music2 class="w-3.5 h-3.5" /> <span>Favorite Mix</span>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- LOCAL FILES SECTION -->
		<section class="space-y-6">
			<div class="flex items-center justify-between flex-wrap gap-4">
				<div class="flex items-center gap-3">
					<div
						class="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center border border-red-500/20"
					>
						<Music2 class="w-5 h-5 text-red-500" />
					</div>
					<div>
						<h2 class="text-2xl font-black tracking-tight">Library</h2>
						<p class="text-xs font-medium" :class="currentTheme.textMuted">
							Your personal audio upload inventory.
						</p>
					</div>
				</div>

				<label
					class="flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl border backdrop-blur-md cursor-pointer transition shadow-sm"
					:class="[
						currentTheme.card,
						currentTheme.border,
						'hover:border-red-500/30',
					]"
				>
					<Upload class="w-4 h-4 text-red-500" />
					<span>Upload Files</span>
					<input
						type="file"
						multiple
						accept="audio/*"
						class="hidden"
						@change="handleLocalUpload"
					/>
				</label>
			</div>

			<div class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				<div
					v-for="music in filtered"
					:key="music.id"
					@click="playMusic(music, filtered)"
					class="group rounded-2xl overflow-hidden border transition cursor-pointer flex flex-col shadow-sm"
					:class="[
						currentTheme.card,
						currentTheme.border,
						'hover:scale-[1.01]',
					]"
				>
					<div class="aspect-square overflow-hidden relative bg-zinc-500/10">
						<img
							:src="music.image"
							@error="
								(e) =>
									(e.target.src =
										'https://placehold.co/600x600/18181b/FFFFFF?text=No+Cover')
							"
							class="w-full h-full object-cover group-hover:scale-105 transition duration-500"
							alt="Cover art"
							loading="lazy"
						/>
						<div
							class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300"
						/>
						<button
							class="absolute bottom-4 right-4 w-11 h-11 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-md shadow-red-500/30"
						>
							<Play class="w-5 h-5 fill-current ml-0.5" />
						</button>
						<div
							v-if="currentMedia?.id === music.id && isPlaying"
							class="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-green-500 text-white text-[10px] font-bold shadow-md"
						>
							Now Playing
						</div>
					</div>
					<div class="p-4 flex-1 flex flex-col justify-between">
						<div>
							<p class="font-bold truncate text-sm">
								{{ music.title || music.name }}
							</p>
							<p
								class="text-xs truncate mt-0.5"
								:class="currentTheme.textMuted"
							>
								{{ music.artist || "Local Track" }}
							</p>
						</div>
						<div
							class="flex items-center gap-1.5 mt-4 text-[10px] font-bold text-red-500 uppercase tracking-wider"
						>
							<Music2 class="w-3.5 h-3.5" /> <span>Local Storage</span>
						</div>
					</div>
				</div>
			</div>
		</section>
	</div>
</template>
