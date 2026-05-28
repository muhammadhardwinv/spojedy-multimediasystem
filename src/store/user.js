/** @format */

import { ref, computed, watch } from "vue";

/*
|--------------------------------------------------------------------------
| PREMIUM APPERANCE SKIN CONFIGURATIONS
|--------------------------------------------------------------------------
*/

export const themes = {
	// ORIGINAL DARK
	dark: {
		id: "dark",
		name: "Dark",
		bg: "bg-[#0B0B0F]",
		text: "text-white",
		textMuted: "text-zinc-400",
		card: "bg-zinc-900/80 border-zinc-800",
		border: "border-zinc-800",
		accent:
			"bg-red-500 hover:bg-red-400 text-white shadow-lg shadow-red-500/20",
	},

	// LIGHT
	light: {
		id: "light",
		name: "Light",
		bg: "bg-zinc-100",
		text: "text-zinc-900",
		textMuted: "text-zinc-500",
		card: "bg-white/80 border-zinc-200",
		border: "border-zinc-200",
		accent: "bg-zinc-900 hover:bg-zinc-700 text-white",
	},

	// SYNTHWAVE
	synthwave: {
		id: "synthwave",
		name: "Synthwave",
		bg: "bg-gradient-to-br from-[#120018] via-[#1A1035] to-[#090014]",
		text: "text-pink-100",
		textMuted: "text-pink-300/60",
		card: "bg-pink-500/10 border-pink-500/20 backdrop-blur-xl",
		border: "border-pink-500/20",
		accent:
			"bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white shadow-lg shadow-pink-500/30",
	},

	// OCEAN
	ocean: {
		id: "ocean",
		name: "Ocean",
		bg: "bg-gradient-to-br from-[#031525] via-[#06253D] to-[#04111D]",
		text: "text-cyan-50",
		textMuted: "text-cyan-200/60",
		card: "bg-cyan-500/10 border-cyan-500/20 backdrop-blur-xl",
		border: "border-cyan-500/20",
		accent:
			"bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30",
	},

	// EMERALD
	emerald: {
		id: "emerald",
		name: "Emerald",
		bg: "bg-gradient-to-br from-[#03140D] via-[#072A1B] to-[#020B07]",
		text: "text-emerald-50",
		textMuted: "text-emerald-200/60",
		card: "bg-emerald-500/10 border-emerald-500/20 backdrop-blur-xl",
		border: "border-emerald-500/20",
		accent:
			"bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/30",
	},

	// ROSE GOLD
	rosegold: {
		id: "rosegold",
		name: "Rose Gold",
		bg: "bg-gradient-to-br from-[#2B1115] via-[#3D181D] to-[#120608]",
		text: "text-rose-50",
		textMuted: "text-rose-200/60",
		card: "bg-rose-500/10 border-rose-500/20 backdrop-blur-xl",
		border: "border-rose-500/20",
		accent:
			"bg-gradient-to-r from-rose-400 to-orange-300 text-black shadow-lg shadow-rose-500/20",
	},
};

/*
|--------------------------------------------------------------------------
| LOCAL STORAGE KEYS
|--------------------------------------------------------------------------
*/

const PROFILE_STORAGE_KEY = "spojedy-user-profile";
const THEME_STORAGE_KEY = "spojedy-user-theme";

/*
|--------------------------------------------------------------------------
| DEFAULT USER PROFILE
|--------------------------------------------------------------------------
*/

const defaultProfile = {
	name: "Ahmed Hardwin",

	email: "ahmed@example.com",

	avatar:
		"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",

	banner:
		"https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=1600&auto=format&fit=crop",

	stats: {
		minutesListened: 48291,

		avgPerDay: 134,

		preferredGenre: "Synthwave",

		preferredVibe: "Night Drive",
	},

	history: [
		{
			id: 1,
			title: "After Dark",
			artist: "Mr.Kitty",
			duration: "4:12",
			playedAt: "2m ago",
		},

		{
			id: 2,
			title: "Blinding Lights",
			artist: "The Weeknd",
			duration: "3:45",
			playedAt: "12m ago",
		},

		{
			id: 3,
			title: "Resonance",
			artist: "HOME",
			duration: "3:33",
			playedAt: "27m ago",
		},
	],
};

/*
|--------------------------------------------------------------------------
| LOAD SAVED PROFILE
|--------------------------------------------------------------------------
*/

const savedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);

export const userProfile = ref(
	savedProfile ? JSON.parse(savedProfile) : defaultProfile
);

/*
|--------------------------------------------------------------------------
| THEME STATE
|--------------------------------------------------------------------------
*/

const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || "dark";

export const selectedTheme = ref(savedTheme);

/*
|--------------------------------------------------------------------------
| CURRENT THEME COMPUTED
|--------------------------------------------------------------------------
*/

export const currentTheme = computed(() => {
	return themes[selectedTheme.value] || themes.dark;
});

/*
|--------------------------------------------------------------------------
| SET THEME
|--------------------------------------------------------------------------
*/

export const setTheme = (themeId) => {
	if (!themes[themeId]) return;

	selectedTheme.value = themeId;

	localStorage.setItem(THEME_STORAGE_KEY, themeId);

	// realtime sync event
	window.dispatchEvent(new Event("spojedy-theme-updated"));
};

/*
|--------------------------------------------------------------------------
| UPDATE PROFILE
|--------------------------------------------------------------------------
*/

export const updateProfile = (updates) => {
	userProfile.value = {
		...userProfile.value,

		...updates,

		stats: {
			...userProfile.value.stats,

			...(updates.stats || {}),
		},
	};

	// realtime sync event
	window.dispatchEvent(new Event("spojedy-profile-updated"));
};

/*
|--------------------------------------------------------------------------
| ADD HISTORY ITEM
|--------------------------------------------------------------------------
*/

export const addHistoryItem = (track) => {
	userProfile.value.history.unshift({
		id: Date.now(),

		...track,
	});

	// limit history size
	userProfile.value.history = userProfile.value.history.slice(0, 50);
};

/*
|--------------------------------------------------------------------------
| CLEAR HISTORY
|--------------------------------------------------------------------------
*/

export const clearHistory = () => {
	userProfile.value.history = [];
};

/*
|--------------------------------------------------------------------------
| RESET PROFILE
|--------------------------------------------------------------------------
*/

export const resetProfile = () => {
	userProfile.value = defaultProfile;

	selectedTheme.value = "dark";

	localStorage.removeItem(PROFILE_STORAGE_KEY);

	localStorage.removeItem(THEME_STORAGE_KEY);
};

/*
|--------------------------------------------------------------------------
| AUTO SAVE PROFILE
|--------------------------------------------------------------------------
*/

watch(
	userProfile,
	(newValue) => {
		localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(newValue));
	},
	{
		deep: true,
	}
);

/*
|--------------------------------------------------------------------------
| AUTO SAVE THEME
|--------------------------------------------------------------------------
*/

watch(selectedTheme, (theme) => {
	localStorage.setItem(THEME_STORAGE_KEY, theme);
});
