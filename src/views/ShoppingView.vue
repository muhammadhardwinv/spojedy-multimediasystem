<!-- @format -->

<script setup>
import { computed, ref } from "vue";

import {
	ShoppingBag,
	Search,
	Flame,
	Play,
	Music2,
	Disc3,
	Crown,
	Star,
	BadgeDollarSign,
	Sparkles,
	Headphones,
} from "lucide-vue-next";

import { currentTheme } from "../store/user";

/* ---------------- THEME ---------------- */
const theme = computed(() => currentTheme.value);

/* ---------------- MOCK SHOP ITEMS ---------------- */
const products = ref([
	{
		id: 1,
		title: "After Hours",
		artist: "The Weeknd",
		price: "$9.99",
		type: "Album License",
		image:
			"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=1200&auto=format&fit=crop",
		tag: "Trending",
	},
	{
		id: 2,
		title: "Cyber Dreams",
		artist: "Neon Runner",
		price: "$14.99",
		type: "Hi-Res Audio",
		image:
			"https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=1200&auto=format&fit=crop",
		tag: "Premium",
	},
	{
		id: 3,
		title: "Nightfall Drive",
		artist: "Tokyo Pulse",
		price: "$4.99",
		type: "Single Track",
		image:
			"https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1200&auto=format&fit=crop",
		tag: "Popular",
	},
	{
		id: 4,
		title: "Velvet Horizon",
		artist: "Aurora Lights",
		price: "$19.99",
		type: "Collector Edition",
		image:
			"https://images.unsplash.com/photo-1501612780327-45045538702b?q=80&w=1200&auto=format&fit=crop",
		tag: "Exclusive",
	},
]);

/* ---------------- FEATURED CATEGORIES ---------------- */
const categories = [
	{
		name: "Premium Albums",
		icon: Disc3,
	},
	{
		name: "Hi-Res Audio",
		icon: Headphones,
	},
	{
		name: "Exclusive Tracks",
		icon: Crown,
	},
	{
		name: "Trending Music",
		icon: Flame,
	},
];
</script>

<template>
	<div
		class="min-h-screen p-6 md:p-8 transition-colors duration-500"
		:class="[theme.bg, theme.text]"
	>
		<div class="max-w-7xl mx-auto">
			<!-- HERO -->
			<div
				class="relative overflow-hidden rounded-[32px] border p-8 md:p-10 transition-all duration-500"
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
					<div class="flex items-center gap-5">
						<div
							class="w-16 h-16 rounded-3xl flex items-center justify-center border"
							:class="[theme.card, theme.border]"
						>
							<ShoppingBag class="w-8 h-8 text-red-400" />
						</div>

						<div>
							<h1 class="text-4xl md:text-5xl font-black tracking-tight">
								Shopping
							</h1>

							<p class="mt-2 text-sm md:text-base" :class="theme.textMuted">
								Rent, buy, and unlock premium music experiences with immersive
								audio quality.
							</p>
						</div>
					</div>

					<!-- SEARCH -->
					<div class="mt-8 relative">
						<Search
							class="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5"
							:class="theme.textMuted"
						/>

						<input
							type="text"
							placeholder="Search premium albums, artists, tracks..."
							class="w-full h-14 rounded-2xl border pl-14 pr-5 outline-none transition-all duration-300"
							:class="[theme.card, theme.border, theme.text]"
						/>
					</div>

					<!-- CATEGORY PILLS -->
					<div class="mt-6 flex flex-wrap gap-3">
						<button
							v-for="category in categories"
							:key="category.name"
							class="px-5 py-3 rounded-2xl border flex items-center gap-3 transition-all duration-300 hover:scale-[1.03]"
							:class="[theme.card, theme.border]"
						>
							<component :is="category.icon" class="w-4 h-4 text-red-400" />

							<span class="text-sm font-medium">
								{{ category.name }}
							</span>
						</button>
					</div>
				</div>
			</div>

			<!-- FEATURE BANNERS -->
			<div class="grid lg:grid-cols-3 gap-5 mt-10">
				<div
					class="rounded-[28px] border p-6 transition-all duration-300 hover:scale-[1.02]"
					:class="[theme.card, theme.border]"
				>
					<div
						class="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center mb-5"
					>
						<Crown class="w-7 h-7 text-red-400" />
					</div>

					<h3 class="text-xl font-bold">Exclusive Membership</h3>

					<p class="mt-2 text-sm" :class="theme.textMuted">
						Unlock ultra HD streaming, premium-only albums, and early releases.
					</p>
				</div>

				<div
					class="rounded-[28px] border p-6 transition-all duration-300 hover:scale-[1.02]"
					:class="[theme.card, theme.border]"
				>
					<div
						class="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center mb-5"
					>
						<BadgeDollarSign class="w-7 h-7 text-red-400" />
					</div>

					<h3 class="text-xl font-bold">Rent & Own</h3>

					<p class="mt-2 text-sm" :class="theme.textMuted">
						Flexible purchasing system for casual listeners and collectors.
					</p>
				</div>

				<div
					class="rounded-[28px] border p-6 transition-all duration-300 hover:scale-[1.02]"
					:class="[theme.card, theme.border]"
				>
					<div
						class="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center mb-5"
					>
						<Sparkles class="w-7 h-7 text-red-400" />
					</div>

					<h3 class="text-xl font-bold">Curated Collections</h3>

					<p class="mt-2 text-sm" :class="theme.textMuted">
						Hand-picked premium albums and exclusive sound experiences.
					</p>
				</div>
			</div>

			<!-- SECTION TITLE -->
			<div class="mt-14 flex items-center justify-between gap-4">
				<div>
					<h2 class="text-3xl font-black">Featured Releases</h2>

					<p class="mt-2 text-sm" :class="theme.textMuted">
						Trending premium tracks and exclusive album collections.
					</p>
				</div>

				<div
					class="hidden md:flex items-center gap-2 px-5 py-3 rounded-2xl border"
					:class="[theme.card, theme.border]"
				>
					<Flame class="w-5 h-5 text-red-400" />

					<span class="text-sm font-medium"> Top Selling This Week </span>
				</div>
			</div>

			<!-- PRODUCT GRID -->
			<div class="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				<div
					v-for="product in products"
					:key="product.id"
					class="group overflow-hidden rounded-[30px] border transition-all duration-500 hover:scale-[1.02]"
					:class="[theme.card, theme.border]"
				>
					<!-- COVER -->
					<div class="relative aspect-square overflow-hidden">
						<img
							:src="product.image"
							class="w-full h-full object-cover transition duration-700 group-hover:scale-110"
						/>

						<div
							class="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent"
						/>

						<div
							class="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/20 border border-red-500/30 text-red-400 backdrop-blur-md"
						>
							{{ product.tag }}
						</div>

						<button
							class="absolute bottom-4 right-4 w-14 h-14 rounded-full bg-red-500 flex items-center justify-center shadow-xl shadow-red-500/30 opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300"
						>
							<Play class="w-6 h-6 text-white ml-1" />
						</button>
					</div>

					<!-- INFO -->
					<div class="p-5">
						<div class="flex items-start justify-between gap-4">
							<div class="min-w-0">
								<h3 class="text-lg font-bold truncate">
									{{ product.title }}
								</h3>

								<p class="mt-1 text-sm truncate" :class="theme.textMuted">
									{{ product.artist }}
								</p>
							</div>

							<div
								class="px-3 py-1 rounded-full text-xs font-semibold border"
								:class="[theme.card, theme.border]"
							>
								{{ product.price }}
							</div>
						</div>

						<div class="mt-5 flex items-center justify-between">
							<div
								class="flex items-center gap-2 text-xs"
								:class="theme.textMuted"
							>
								<Music2 class="w-4 h-4" />

								<span>{{ product.type }}</span>
							</div>

							<div class="flex items-center gap-1">
								<Star class="w-4 h-4 text-yellow-400 fill-yellow-400" />
								<Star class="w-4 h-4 text-yellow-400 fill-yellow-400" />
								<Star class="w-4 h-4 text-yellow-400 fill-yellow-400" />
								<Star class="w-4 h-4 text-yellow-400 fill-yellow-400" />
								<Star class="w-4 h-4 text-yellow-400 fill-yellow-400" />
							</div>
						</div>

						<button
							class="w-full mt-6 h-12 rounded-2xl font-semibold transition-all duration-300 hover:scale-[1.01]"
							:class="theme.accent"
						>
							Buy Now
						</button>
					</div>
				</div>
			</div>

			<!-- BOTTOM CTA -->
			<div
				class="mt-16 rounded-[32px] border p-8 md:p-10 text-center overflow-hidden relative"
				:class="[theme.card, theme.border]"
			>
				<div
					class="absolute inset-0 opacity-30 pointer-events-none"
					:class="
						theme.id === 'cyber'
							? 'bg-gradient-to-r from-cyan-500/10 via-fuchsia-500/10 to-transparent'
							: 'bg-gradient-to-r from-red-500/10 via-transparent to-transparent'
					"
				/>

				<div class="relative z-10">
					<div
						class="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6"
					>
						<ShoppingBag class="w-10 h-10 text-red-400" />
					</div>

					<h2 class="text-3xl md:text-4xl font-black">
						Build Your Premium Library
					</h2>

					<p
						class="mt-4 max-w-2xl mx-auto text-sm md:text-base"
						:class="theme.textMuted"
					>
						Collect high-quality albums, unlock exclusive releases, and elevate
						your listening ecosystem with premium ownership access.
					</p>

					<button
						class="mt-8 h-14 px-8 rounded-2xl font-semibold transition-all duration-300 hover:scale-[1.03]"
						:class="theme.accent"
					>
						Explore Marketplace
					</button>
				</div>
			</div>
		</div>
	</div>
</template>
