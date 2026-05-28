<!-- @format -->

<script setup>
import { currentTheme } from "../store/user";
import { favorites, toggleFavorite } from "../store/favorites";
import { setPlaylist } from "../store/player";
import { useRouter } from "vue-router";
import { Play, Trash2 } from "lucide-vue-next";

const router = useRouter();

/* PLAY FROM FAVORITES */
const playSong = (song) => {
	if (!favorites.value.length) return;

	const index = favorites.value.findIndex((m) => m.title === song.title);
	setPlaylist(favorites.value, index >= 0 ? index : 0);
	router.push("/player");
};
</script>

<template>
	<div class="p-8 space-y-6">
		<h1 class="text-3xl font-black tracking-tight">Your Favorites</h1>

		<div
			v-if="favorites.length === 0"
			:class="currentTheme.textMuted"
			class="text-sm font-medium"
		>
			No favorite songs yet.
		</div>

		<div v-else class="space-y-3">
			<div
				v-for="song in favorites"
				:key="song.title"
				class="flex items-center justify-between p-4 border rounded-xl backdrop-blur-md transition group shadow-sm"
				:class="[currentTheme.card, currentTheme.border]"
			>
				<!-- LEFT CONTENT -->
				<div class="flex items-center gap-3 min-w-0">
					<img
						:src="song.image || '/default.jpg'"
						class="w-12 h-12 rounded-lg object-cover shadow-sm bg-zinc-500/10 shrink-0"
						alt="Song artwork"
					/>
					<div class="truncate">
						<p class="font-bold truncate text-sm">{{ song.title }}</p>
						<p class="text-xs truncate mt-0.5" :class="currentTheme.textMuted">
							{{ song.artist }}
						</p>
					</div>
				</div>

				<!-- ACTIONS -->
				<div class="flex items-center gap-2.5 shrink-0">
					<button
						@click="playSong(song)"
						class="p-2.5 rounded-xl transition flex items-center justify-center text-white shadow-md shadow-red-500/10"
						:class="currentTheme.accent"
					>
						<Play class="w-4 h-4 fill-current" />
					</button>

					<button
						@click="toggleFavorite(song)"
						class="p-2.5 rounded-xl border transition flex items-center justify-center hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20"
						:class="currentTheme.border"
					>
						<Trash2 class="w-4 h-4" />
					</button>
				</div>
			</div>
		</div>
	</div>
</template>
