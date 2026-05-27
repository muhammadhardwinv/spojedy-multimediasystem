/** @format */

import { ref } from "vue";
import { get, set } from "idb-keyval";

export const localFiles = ref([]);

/* ---------------- SAVE ---------------- */
const saveFiles = async () => {
	// remove runtime src before saving
	const cleaned = localFiles.value.map((file) => ({
		...file,
		src: null,
	}));

	await set("localFiles", cleaned);
};

/* ---------------- LOAD ---------------- */
export const loadFiles = async () => {
	// cleanup old blob urls
	localFiles.value.forEach((f) => {
		if (f.src) {
			URL.revokeObjectURL(f.src);
		}
	});

	const data = (await get("localFiles")) || [];

	localFiles.value = data.map((file) => ({
		...file,

		// recreate blob URL after refresh
		src: file.blob ? URL.createObjectURL(file.blob) : "",
	}));
};

/* ---------------- ADD ---------------- */
export const addLocalFiles = async (files = []) => {
	const formatted = files.map((file) => ({
		id: file.id,

		name: file.name,
		type: file.type,
		size: file.size,

		genre: file.genre || "Unknown",

		source: "local",

		// IMPORTANT
		blob: file.file,

		// runtime object url
		src: URL.createObjectURL(file.file),
	}));

	localFiles.value.push(...formatted);

	await saveFiles();
};

/* ---------------- REMOVE ---------------- */
export const removeLocalFile = async (id) => {
	const target = localFiles.value.find((f) => f.id === id);

	if (target?.src) {
		URL.revokeObjectURL(target.src);
	}

	localFiles.value = localFiles.value.filter((f) => f.id !== id);

	await saveFiles();
};

/* ---------------- CLEAR ---------------- */
export const clearLocalFiles = async () => {
	localFiles.value.forEach((f) => {
		if (f.src) {
			URL.revokeObjectURL(f.src);
		}
	});

	localFiles.value = [];

	await set("localFiles", []);
};
