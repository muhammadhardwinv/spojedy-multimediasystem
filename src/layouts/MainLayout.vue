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

import { currentTheme, userProfile } from "../store/user";

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
	<div
		:class="[
			'min-h-screen flex transition-colors duration-300',
			currentTheme.bg,
			currentTheme.text,
		]"
	>
		<!-- SIDEBAR -->
		<aside
			:class="[
				'w-24 border-r flex flex-col items-center py-8 gap-6 transition-colors duration-300 shrink-0 backdrop-blur-md',
				currentTheme.id === 'light'
					? 'bg-white/80 border-zinc-200 shadow-xl shadow-zinc-200/30'
					: 'bg-black/20 border-white/5',
			]"
		>
			<!-- PLAYER BUTTON -->
			<router-link
				to="/player"
				class="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 relative overflow-hidden"
				:class="
					currentMedia
						? `
							${currentTheme.accent}
							scale-105
							shadow-xl
							ring-2
							${currentTheme.id === 'light' ? 'ring-zinc-300' : 'ring-white/10'}
						`
						: currentTheme.id === 'light'
							? `
								bg-zinc-100
								text-zinc-500
								hover:bg-zinc-200
								hover:text-zinc-900
								hover:scale-105
							`
							: `
								bg-white/5
								text-white/40
								hover:bg-white/10
								hover:text-white
								hover:scale-105
							`
				"
			>
				<div
					v-if="currentMedia"
					class="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"
				/>

				<Music2 class="w-5 h-5 relative z-10" />

				<span
					v-if="isPlaying"
					class="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-md shadow-red-500/50"
				/>
			</router-link>

			<!-- NAVIGATION -->
			<router-link
				v-for="item in navigation"
				:key="item.name"
				:to="item.path"
				v-slot="{ isExactActive }"
			>
				<div
					:class="[
						'w-14 h-14 flex items-center justify-center rounded-2xl transition-all duration-300 relative overflow-hidden cursor-pointer',

						isExactActive
							? `
								${currentTheme.accent}
								scale-110
								shadow-2xl
								ring-2
								${
									currentTheme.id === 'light'
										? 'ring-zinc-300 text-white'
										: 'ring-white/10 text-white'
								}
							`
							: currentTheme.id === 'light'
								? `
									text-zinc-500
									bg-transparent
									hover:text-zinc-900
									hover:bg-zinc-200/80
									hover:scale-105
								`
								: `
									text-white/45
									hover:text-white
									hover:bg-white/5
									hover:scale-105
								`,
					]"
				>
					<!-- ACTIVE GLOW -->
					<div
						v-if="isExactActive"
						class="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"
					/>

					<!-- ICON -->
					<component
						:is="item.icon"
						:size="20"
						:class="[
							'transition-all duration-300 relative z-10',
							isExactActive ? 'scale-110' : '',
						]"
					/>
				</div>
			</router-link>

			<!-- PROFILE -->
			<div class="mt-auto">
				<router-link to="/profile">
					<img
						:src="userProfile.avatar"
						alt="User profile shortcut icon"
						:class="[
							'w-10 h-10 rounded-full object-cover border-2 transition-all duration-300 shadow-lg hover:scale-105',
							currentTheme.id === 'light'
								? 'border-zinc-200 hover:border-zinc-400'
								: 'border-transparent hover:border-red-500/50',
						]"
					/>
				</router-link>
			</div>
		</aside>

		<!-- MAIN CONTENT -->
		<main class="flex-1 overflow-y-auto">
			<router-view :key="$route.fullPath" />
		</main>
	</div>
</template>
