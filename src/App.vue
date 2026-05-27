<!-- @format -->

<script setup>
import GlobalPlayer from "./components/GlobalPlayer.vue";
import { onMounted } from "vue";
import { loadFiles } from "./store/localFiles";

onMounted(() => {
	loadFiles();
});
</script>

<template>
	<RouterView />

	<GlobalPlayer />
</template>
