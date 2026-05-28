<!-- @format -->

<script setup>
import { ref } from "vue";
import {
	userProfile,
	currentTheme,
	themes,
	setTheme,
	updateProfile,
} from "../store/user";
import {
	Clock,
	Music,
	Smile,
	Palette,
	Camera,
	Check,
	Calendar,
	History,
	Image,
	Mail,
} from "lucide-vue-next";

const isEditing = ref(false);
const editName = ref(userProfile.value.name);
const editEmail = ref(userProfile.value.email);
const editGenre = ref(userProfile.value.stats.preferredGenre);
const editVibe = ref(userProfile.value.stats.preferredVibe);

// Handle avatar image updates
const handleAvatarChange = (event) => {
	const file = event.target.files[0];
	if (file) updateProfile({ avatar: URL.createObjectURL(file) });
};

// Handle hero banner image updates
const handleBannerChange = (event) => {
	const file = event.target.files[0];
	if (file) updateProfile({ banner: URL.createObjectURL(file) });
};

const saveProfile = () => {
	updateProfile({
		name: editName.value,
		email: editEmail.value,
		stats: {
			...userProfile.value.stats,
			preferredGenre: editGenre.value,
			preferredVibe: editVibe.value,
		},
	});
	isEditing.value = false;
};
</script>

<template>
	<div
		:class="[
			'min-h-screen transition-colors duration-300 pb-16',
			currentTheme.bg,
			currentTheme.text,
		]"
	>
		<!-- HERO COVER IMAGE -->
		<div
			class="h-64 md:h-80 w-full relative overflow-hidden bg-zinc-950 group/banner"
		>
			<img
				:src="userProfile.banner"
				class="w-full h-full object-cover opacity-60 group-hover/banner:scale-105 transition duration-700 ease-out"
				alt="Profile banner"
			/>
			<div
				class="absolute inset-0 bg-gradient-to-t from-[#0B0B0F] via-transparent to-black/40"
				:style="{
					'--tw-gradient-from':
						currentTheme.id === 'light' ? '#fafafa' : 'transparent',
				}"
			/>

			<!-- Change Cover Overlay Trigger -->
			<label
				class="absolute top-4 right-4 px-3 py-1.5 bg-black/60 hover:bg-black/80 text-white rounded-lg text-xs font-medium cursor-pointer flex items-center gap-1.5 border border-white/10 backdrop-blur-sm opacity-0 group-hover/banner:opacity-100 transition-opacity z-20"
			>
				<Image class="w-3.5 h-3.5" /> Change Cover
				<input
					type="file"
					accept="image/*"
					class="hidden"
					@change="handleBannerChange"
				/>
			</label>

			<!-- ALL 10 PREMIUM SKINS GRID MATRIX WRAPPER -->
			<div
				class="absolute top-4 left-4 p-1.5 rounded-xl bg-black/60 border border-white/10 backdrop-blur-md flex flex-wrap items-center gap-1 max-w-[calc(100%-2rem)] md:max-w-xl z-20"
			>
				<div
					class="text-[10px] uppercase font-black px-2 text-zinc-400 flex items-center gap-1 shrink-0"
				>
					<Palette class="w-3 h-3" /> Skin
				</div>
				<div class="flex flex-wrap gap-1 max-h-24 overflow-y-auto pr-1">
					<button
						v-for="(theme, key) in themes"
						:key="key"
						@click="setTheme(key)"
						class="px-2.5 py-1 text-[11px] font-bold rounded-lg capitalize transition-all duration-200"
						:class="
							currentTheme.id === key
								? 'bg-white text-zinc-950 font-black shadow-sm'
								: 'text-zinc-300 hover:text-white hover:bg-white/10'
						"
					>
						{{ theme.name || key }}
					</button>
				</div>
			</div>
		</div>

		<!-- MAIN GRID METRICS ENGINE AND DETAILS SECTION -->
		<div class="max-w-6xl mx-auto px-6 -mt-20 relative z-10">
			<div class="flex flex-col lg:flex-row gap-8 items-start">
				<!-- SIDEBAR CARD CONTAINER -->
				<div
					class="w-full lg:w-80 border rounded-2xl p-6 backdrop-blur-md shrink-0 shadow-xl"
					:class="currentTheme.card"
				>
					<div class="flex flex-col items-center text-center">
						<div
							class="relative w-32 h-32 -mt-20 mb-4 group cursor-pointer border-4 border-[#0B0B0F] rounded-full overflow-hidden shadow-2xl"
							:class="{ 'border-zinc-50': currentTheme.id === 'light' }"
						>
							<img
								:src="userProfile.avatar"
								class="w-full h-full object-cover"
								alt="Avatar"
							/>
							<label
								class="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[10px] font-semibold transition-opacity cursor-pointer"
							>
								<Camera class="w-4 h-4 mb-1" /> Profile Pic
								<input
									type="file"
									accept="image/*"
									class="hidden"
									@change="handleAvatarChange"
								/>
							</label>
						</div>

						<!-- READ MODE -->
						<div v-if="!isEditing" class="w-full">
							<h2 class="text-2xl font-black tracking-tight">
								{{ userProfile.name }}
							</h2>
							<p
								class="text-xs mb-6 flex items-center justify-center gap-1.5"
								:class="currentTheme.textMuted"
							>
								<Mail class="w-3 h-3" /> {{ userProfile.email }}
							</p>
							<button
								@click="isEditing = true"
								class="w-full py-2.5 text-xs font-bold rounded-xl border transition"
								:class="[currentTheme.border, 'hover:bg-zinc-500/10']"
							>
								Edit Preferences
							</button>
						</div>

						<!-- WRITE EDITING MODE FORM -->
						<div v-else class="w-full space-y-3 text-left">
							<div>
								<label
									class="text-[10px] font-bold uppercase tracking-wider block mb-1"
									:class="currentTheme.textMuted"
									>Username</label
								>
								<input
									v-model="editName"
									type="text"
									class="w-full text-xs p-2 bg-zinc-500/10 border rounded-lg focus:outline-none focus:border-red-500 text-inherit"
								/>
							</div>
							<div>
								<label
									class="text-[10px] font-bold uppercase tracking-wider block mb-1"
									:class="currentTheme.textMuted"
									>Email Address</label
								>
								<input
									v-model="editEmail"
									type="email"
									class="w-full text-xs p-2 bg-zinc-500/10 border rounded-lg focus:outline-none focus:border-red-500 text-inherit"
								/>
							</div>
							<div class="grid grid-cols-2 gap-2">
								<div>
									<label
										class="text-[10px] font-bold uppercase tracking-wider block mb-1"
										:class="currentTheme.textMuted"
										>Genre</label
									>
									<input
										v-model="editGenre"
										type="text"
										class="w-full text-xs p-2 bg-zinc-500/10 border rounded-lg text-inherit"
									/>
								</div>
								<div>
									<label
										class="text-[10px] font-bold uppercase tracking-wider block mb-1"
										:class="currentTheme.textMuted"
										>Vibe</label
									>
									<input
										v-model="editVibe"
										type="text"
										class="w-full text-xs p-2 bg-zinc-500/10 border rounded-lg text-inherit"
									/>
								</div>
							</div>
							<div class="flex gap-2 pt-2">
								<button
									@click="saveProfile"
									class="flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1 transition"
									:class="currentTheme.accent"
								>
									<Check class="w-3.5 h-3.5" /> Save
								</button>
								<button
									@click="isEditing = false"
									class="px-3 py-2 text-xs font-bold rounded-xl bg-zinc-500/10 border"
									:class="currentTheme.border"
								>
									Cancel
								</button>
							</div>
						</div>
					</div>
				</div>

				<!-- RIGHT DATA PANEL: MUSIC STATISTICS METRICS CARDS -->
				<div class="flex-1 w-full space-y-6">
					<div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
						<!-- PLAYTIME METRIC CARD -->
						<div
							class="border rounded-2xl p-5 transition flex flex-col justify-between"
							:class="currentTheme.card"
						>
							<span class="text-amber-500 p-2 bg-amber-500/10 rounded-xl w-max"
								><Clock class="w-4 h-4"
							/></span>
							<div class="mt-4">
								<p
									class="text-[10px] font-bold uppercase tracking-widest"
									:class="currentTheme.textMuted"
								>
									Playtime
								</p>
								<h4 class="text-xl font-black mt-0.5">
									{{ userProfile.stats.minutesListened.toLocaleString() }}
									<span class="text-xs font-medium">m</span>
								</h4>
							</div>
						</div>

						<!-- DAILY AVERAGE METRIC CARD -->
						<div
							class="border rounded-2xl p-5 transition flex flex-col justify-between"
							:class="currentTheme.card"
						>
							<span
								class="text-emerald-500 p-2 bg-emerald-500/10 rounded-xl w-max"
								><Calendar class="w-4 h-4"
							/></span>
							<div class="mt-4">
								<p
									class="text-[10px] font-bold uppercase tracking-widest"
									:class="currentTheme.textMuted"
								>
									Daily Average
								</p>
								<h4 class="text-xl font-black mt-0.5">
									{{ userProfile.stats.avgPerDay }}
									<span class="text-xs font-medium">m/d</span>
								</h4>
							</div>
						</div>

						<!-- CORE PREFERRED GENRE METRIC CARD -->
						<div
							class="border rounded-2xl p-5 transition flex flex-col justify-between"
							:class="currentTheme.card"
						>
							<span class="text-blue-400 p-2 bg-blue-500/10 rounded-xl w-max"
								><Music class="w-4 h-4"
							/></span>
							<div class="mt-4">
								<p
									class="text-[10px] font-bold uppercase tracking-widest"
									:class="currentTheme.textMuted"
								>
									Core Genre
								</p>
								<h4 class="text-xl font-black mt-0.5 truncate">
									{{ userProfile.stats.preferredGenre }}
								</h4>
							</div>
						</div>

						<!-- CORE PREFERRED VIBE METRIC CARD -->
						<div
							class="border rounded-2xl p-5 transition flex flex-col justify-between"
							:class="currentTheme.card"
						>
							<span
								class="text-purple-400 p-2 bg-purple-500/10 rounded-xl w-max"
								><Smile class="w-4 h-4"
							/></span>
							<div class="mt-4">
								<p
									class="text-[10px] font-bold uppercase tracking-widest"
									:class="currentTheme.textMuted"
								>
									Vibe Metric
								</p>
								<h4 class="text-xl font-black mt-0.5 truncate">
									{{ userProfile.stats.preferredVibe }}
								</h4>
							</div>
						</div>
					</div>

					<!-- RECENT STREAMING ACTIVITY HISTORY CARD -->
					<div
						class="border rounded-2xl p-6 shadow-md"
						:class="currentTheme.card"
					>
						<div
							class="flex items-center gap-2 mb-4 border-b pb-3"
							:class="currentTheme.border"
						>
							<History class="w-4 h-4 text-red-500" />
							<h3 class="font-extrabold text-xs uppercase tracking-widest">
								Listening History Logs
							</h3>
						</div>

						<div class="divide-y" :class="currentTheme.border">
							<div
								v-for="track in userProfile.history"
								:key="track.id"
								class="py-3.5 flex items-center justify-between gap-4 text-xs group"
							>
								<div class="flex items-center gap-3 min-w-0">
									<div
										class="w-8 h-8 rounded-lg bg-zinc-500/10 flex items-center justify-center text-zinc-400 shrink-0"
									>
										<Music class="w-3.5 h-3.5" />
									</div>
									<div class="truncate">
										<p class="font-bold truncate text-sm">{{ track.title }}</p>
										<p
											class="text-[11px] mt-0.5"
											:class="currentTheme.textMuted"
										>
											{{ track.artist }}
										</p>
									</div>
								</div>
								<div
									class="flex items-center gap-4 shrink-0 text-xs"
									:class="currentTheme.textMuted"
								>
									<span>{{ track.duration }}</span>
									<span
										class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-500/10 font-medium"
										>{{ track.playedAt }}</span
									>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
