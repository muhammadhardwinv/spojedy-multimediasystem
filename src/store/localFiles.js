/** @format */

import { ref } from "vue";
import { get, set } from "idb-keyval";

export const localFiles = ref([]);

/* ---------------- LOAD ON START ---------------- */
export const loadFiles = async () => {
	try {
		const data = await get("localFiles");
		localFiles.value = data || [];
	} catch (err) {
		console.error("Failed to load files:", err);
	}
};

/* ---------------- SAVE ---------------- */
const saveFiles = async () => {
	try {
		await set("localFiles", localFiles.value);
	} catch (err) {
		console.error("Failed to save files:", err);
	}
};

/* ---------------- ADD FILES ---------------- */
export const addLocalFiles = async (files = []) => {
	if (!Array.isArray(files)) return;

	const normalized = files.map((f) => ({
		...f,
		id: f.id || crypto.randomUUID(),
	}));

	localFiles.value.push(...normalized);

	await saveFiles();
};

/* ---------------- REMOVE FILE ---------------- */
export const removeLocalFile = async (id) => {
	localFiles.value = localFiles.value.filter((f) => f.id !== id);

	await saveFiles();
};

/* ---------------- CLEAR ---------------- */
export const clearLocalFiles = async () => {
	localFiles.value = [];
	await saveFiles();
};
