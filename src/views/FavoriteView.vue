<!-- @format -->

<script setup>
import { favorites, toggleFavorite } from "../store/favorites";
import { setPlaylist } from "../store/player";
import { useRouter } from "vue-router";
import { Play, Trash2 } from "lucide-vue-next";

const router = useRouter();

/* PLAY FROM FAVORITES (NOW USING PLAYLIST SYSTEM) */
const playSong = (song) => {
	if (!favorites.value.length) return;

	const index = favorites.value.findIndex((m) => m.title === song.title);

	setPlaylist(favorites.value, index >= 0 ? index : 0);

	router.push("/player");
};
</script>

<template>
	<div class="p-8 text-white space-y-6">
		<h1 class="text-3xl font-black">Your Favorites</h1>

		<div v-if="favorites.length === 0" class="text-white/50">
			No favorite songs yet.
		</div>

		<div v-else class="space-y-3">
			<div
				v-for="song in favorites"
				:key="song.title"
				class="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition"
			>
				<!-- LEFT -->
				<div class="flex items-center gap-3">
					<img
						:src="song.image || '/default.jpg'"
						class="w-12 h-12 rounded-lg object-cover"
					/>

					<div>
						<p class="font-semibold">{{ song.title }}</p>
						<p class="text-sm text-white/60">{{ song.artist }}</p>
					</div>
				</div>

				<!-- ACTIONS -->
				<div class="flex items-center gap-3">
					<button
						@click="playSong(song)"
						class="p-2 bg-[#7F1D1D] rounded-lg hover:bg-red-600 transition"
					>
						<Play size="18" />
					</button>

					<button
						@click="toggleFavorite(song)"
						class="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition"
					>
						<Trash2 size="18" />
					</button>
				</div>
			</div>
		</div>
	</div>
</template>
