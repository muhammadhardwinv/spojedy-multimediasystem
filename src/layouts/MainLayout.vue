<!-- @format -->

<script setup>
import {
	Music2,
	House,
	HardDrive,
	Search,
	Heart,
	Flame,
	ShoppingBag,
	ShoppingCart,
	User,
} from "lucide-vue-next";

import { isPlaying, currentMedia } from "../store/player";

const navigation = [
	{ name: "Home", path: "/", icon: House },
	{ name: "Local", path: "/local", icon: HardDrive },
	{ name: "Search", path: "/search", icon: Search },
	{ name: "Favorite", path: "/favorite", icon: Heart },
	{ name: "Trending", path: "/trending", icon: Flame },
	{ name: "Shopping", path: "/shopping", icon: ShoppingBag },
	{ name: "Cart", path: "/cart", icon: ShoppingCart },
	{ name: "Profile", path: "/profile", icon: User },
];
</script>

<template>
	<div class="min-h-screen flex bg-[#0B0B0F] text-white">
		<!-- SIDEBAR -->
		<aside
			class="w-24 border-r border-white/10 bg-white/5 flex flex-col items-center py-8 gap-6"
		>
			<!-- MEDIA PLAYER ICON (NOW ACTIVE INDICATOR) -->
			<router-link
				to="/player"
				class="w-12 h-12 rounded-xl flex items-center justify-center transition relative"
				:class="
					currentMedia
						? 'bg-[#7F1D1D]/30 text-[#7F1D1D]'
						: 'bg-white/5 text-white/50'
				"
			>
				<Music2 class="w-5 h-5" />

				<!-- PLAYING PULSE DOT -->
				<span
					v-if="isPlaying"
					class="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"
				/>
			</router-link>

			<!-- NAV ITEMS -->
			<router-link
				v-for="item in navigation"
				:key="item.name"
				:to="item.path"
				class="w-14 h-14 flex items-center justify-center rounded-xl hover:bg-[#7F1D1D]/20 transition"
				active-class="bg-[#7F1D1D]/30"
			>
				<component :is="item.icon" size="20" />
			</router-link>
		</aside>

		<!-- PAGE AREA -->
		<main class="flex-1 overflow-y-auto">
			<router-view :key="$route.fullPath" />
		</main>
	</div>
</template>
