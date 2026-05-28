<!-- @format -->

<script setup>
import { computed } from "vue";

import { currentTheme } from "../store/user";

import {
	ShoppingCart,
	Trash2,
	Plus,
	Minus,
	ArrowRight,
	Disc3,
	Music2,
	Video,
} from "lucide-vue-next";

/* -------------------------------------------------------------------------- */
/* MOCK CART DATA                                                             */
/* Replace later with Pinia/store/cart.js or backend integration              */
/* -------------------------------------------------------------------------- */

const cartItems = computed(() => [
	{
		id: 1,
		title: "Midnight Resonance",
		artist: "Neon Dreams",
		type: "audio",
		price: 4.99,
		image:
			"https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=800&auto=format&fit=crop",
		qty: 1,
	},
	{
		id: 2,
		title: "Cyber Drift Visual Pack",
		artist: "Spojedy Originals",
		type: "video",
		price: 12.99,
		image:
			"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=800&auto=format&fit=crop",
		qty: 1,
	},
]);

const subtotal = computed(() =>
	cartItems.value.reduce((acc, item) => {
		return acc + item.price * item.qty;
	}, 0)
);

const serviceFee = computed(() => 1.99);

const total = computed(() => subtotal.value + serviceFee.value);

const formatPrice = (price) => {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
	}).format(price);
};
</script>

<template>
	<div
		class="min-h-screen p-6 md:p-10 transition-colors duration-300"
		:class="[currentTheme.bg, currentTheme.text]"
	>
		<div class="max-w-7xl mx-auto">
			<!-- HEADER -->
			<div
				class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10"
			>
				<div>
					<div class="flex items-center gap-4">
						<div
							class="w-16 h-16 rounded-3xl flex items-center justify-center border"
							:class="[currentTheme.card, currentTheme.border]"
						>
							<ShoppingCart class="w-8 h-8" />
						</div>

						<div>
							<h1 class="text-4xl md:text-5xl font-black tracking-tight">
								Cart
							</h1>

							<p class="text-sm mt-2 max-w-xl" :class="currentTheme.textMuted">
								Manage your selected premium tracks, visual packs, and media
								collections before checkout.
							</p>
						</div>
					</div>
				</div>

				<div
					class="rounded-3xl border px-5 py-4 backdrop-blur-xl"
					:class="[currentTheme.card, currentTheme.border]"
				>
					<p
						class="text-xs uppercase tracking-[0.2em]"
						:class="currentTheme.textMuted"
					>
						Items Selected
					</p>

					<h2 class="text-3xl font-black mt-1">
						{{ cartItems.length }}
					</h2>
				</div>
			</div>

			<!-- EMPTY -->
			<div
				v-if="!cartItems.length"
				class="rounded-[32px] border p-16 text-center backdrop-blur-xl"
				:class="[currentTheme.card, currentTheme.border]"
			>
				<div
					class="w-24 h-24 rounded-full mx-auto flex items-center justify-center border mb-6"
					:class="[currentTheme.border]"
				>
					<ShoppingCart class="w-10 h-10 opacity-50" />
				</div>

				<h2 class="text-2xl font-bold">Your cart is empty</h2>

				<p
					class="mt-3 text-sm max-w-md mx-auto"
					:class="currentTheme.textMuted"
				>
					Start exploring the marketplace and add premium audio tracks or video
					content into your collection.
				</p>

				<button
					class="mt-8 px-6 py-3 rounded-2xl font-semibold transition-all duration-300"
					:class="currentTheme.accent"
				>
					Browse Marketplace
				</button>
			</div>

			<!-- CONTENT -->
			<div
				v-else
				class="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-8 items-start"
			>
				<!-- CART ITEMS -->
				<div class="space-y-5">
					<div
						v-for="item in cartItems"
						:key="item.id"
						class="rounded-[30px] border overflow-hidden backdrop-blur-xl transition-all duration-300 hover:-translate-y-1"
						:class="[currentTheme.card, currentTheme.border]"
					>
						<div class="flex flex-col md:flex-row">
							<!-- COVER -->
							<div class="relative md:w-[240px] aspect-video md:aspect-square">
								<img :src="item.image" class="w-full h-full object-cover" />

								<div
									class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"
								/>

								<div
									class="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md border flex items-center gap-2"
									:class="[currentTheme.card, currentTheme.border]"
								>
									<Video v-if="item.type === 'video'" class="w-3.5 h-3.5" />

									<Music2 v-else class="w-3.5 h-3.5" />

									<span>
										{{ item.type === "video" ? "Video Pack" : "Audio Track" }}
									</span>
								</div>
							</div>

							<!-- INFO -->
							<div class="flex-1 p-6 flex flex-col justify-between gap-6">
								<div>
									<div class="flex items-start justify-between gap-4">
										<div class="min-w-0">
											<h2 class="text-2xl font-black truncate">
												{{ item.title }}
											</h2>

											<p
												class="mt-2 text-sm truncate"
												:class="currentTheme.textMuted"
											>
												{{ item.artist }}
											</p>
										</div>

										<button
											class="w-11 h-11 rounded-2xl border flex items-center justify-center transition-all duration-300 hover:text-red-400 hover:border-red-500/40 hover:bg-red-500/10"
											:class="[currentTheme.border]"
										>
											<Trash2 class="w-4 h-4" />
										</button>
									</div>

									<div class="flex items-center gap-2 mt-5">
										<div
											class="px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-2"
											:class="[currentTheme.border]"
										>
											<Disc3 class="w-3.5 h-3.5" />
											Lossless Quality
										</div>

										<div
											class="px-3 py-1.5 rounded-xl border text-xs font-semibold"
											:class="[currentTheme.border]"
										>
											Lifetime Access
										</div>
									</div>
								</div>

								<div
									class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5"
								>
									<!-- QUANTITY -->
									<div
										class="flex items-center gap-4 w-max px-4 py-3 rounded-2xl border"
										:class="[currentTheme.border]"
									>
										<button
											class="w-8 h-8 rounded-xl border flex items-center justify-center transition"
											:class="[currentTheme.border]"
										>
											<Minus class="w-3.5 h-3.5" />
										</button>

										<span class="font-bold text-lg">
											{{ item.qty }}
										</span>

										<button
											class="w-8 h-8 rounded-xl border flex items-center justify-center transition"
											:class="[currentTheme.border]"
										>
											<Plus class="w-3.5 h-3.5" />
										</button>
									</div>

									<!-- PRICE -->
									<div class="text-right">
										<p
											class="text-xs uppercase tracking-widest"
											:class="currentTheme.textMuted"
										>
											Price
										</p>

										<h3 class="text-3xl font-black mt-1">
											{{ formatPrice(item.price) }}
										</h3>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- SUMMARY -->
				<div
					class="rounded-[32px] border p-7 backdrop-blur-xl sticky top-8"
					:class="[currentTheme.card, currentTheme.border]"
				>
					<div class="flex items-center gap-3 mb-8">
						<div
							class="w-12 h-12 rounded-2xl flex items-center justify-center border"
							:class="[currentTheme.border]"
						>
							<ShoppingCart class="w-5 h-5" />
						</div>

						<div>
							<h2 class="text-2xl font-black">Summary</h2>

							<p class="text-xs mt-1" :class="currentTheme.textMuted">
								Premium purchase overview
							</p>
						</div>
					</div>

					<div class="space-y-5">
						<div class="flex items-center justify-between">
							<span :class="currentTheme.textMuted">Subtotal</span>

							<span class="font-semibold">
								{{ formatPrice(subtotal) }}
							</span>
						</div>

						<div class="flex items-center justify-between">
							<span :class="currentTheme.textMuted">Service Fee</span>

							<span class="font-semibold">
								{{ formatPrice(serviceFee) }}
							</span>
						</div>

						<div
							class="border-t pt-5 flex items-center justify-between"
							:class="[currentTheme.border]"
						>
							<div>
								<p class="text-sm" :class="currentTheme.textMuted">
									Total Payment
								</p>

								<h3 class="text-3xl font-black mt-1">
									{{ formatPrice(total) }}
								</h3>
							</div>

							<div
								class="w-14 h-14 rounded-2xl flex items-center justify-center"
								:class="currentTheme.accent"
							>
								<ArrowRight class="w-6 h-6" />
							</div>
						</div>
					</div>

					<button
						class="w-full mt-8 py-4 rounded-2xl font-bold transition-all duration-300 hover:scale-[1.02]"
						:class="currentTheme.accent"
					>
						Proceed to Checkout
					</button>

					<p
						class="text-xs text-center mt-4 leading-relaxed"
						:class="currentTheme.textMuted"
					>
						Secure payment gateway with unlimited streaming access after
						purchase completion.
					</p>
				</div>
			</div>
		</div>
	</div>
</template>
