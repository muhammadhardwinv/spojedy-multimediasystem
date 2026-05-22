/** @format */
import { ref, watch } from "vue";

const saved = localStorage.getItem("favorites");

export const favorites = ref(saved ? JSON.parse(saved) : []);

export const toggleFavorite = (song) => {
	if (!song) return;

	const index = favorites.value.findIndex((m) => m.title === song.title);

	if (index >= 0) {
		favorites.value.splice(index, 1);
	} else {
		favorites.value.push(song);
	}
};

export const isFavorite = (song) => {
	if (!song) return false;
	return favorites.value.some((m) => m.title === song.title);
};

/* persist */
watch(
	favorites,
	(val) => {
		localStorage.setItem("favorites", JSON.stringify(val));
	},
	{ deep: true }
);
