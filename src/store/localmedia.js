/** @format */

import { ref } from "vue";

export const localFiles = ref([]);

export const addLocalFiles = (files) => {
	localFiles.value.push(...files);
};

export const removeLocalFile = (id) => {
	localFiles.value = localFiles.value.filter((file) => file.id !== id);
};
