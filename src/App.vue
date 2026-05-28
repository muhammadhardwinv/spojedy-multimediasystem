<!-- @format -->

<script setup>
import { onMounted } from "vue";
import { RouterView } from "vue-router";
import GlobalPlayer from "./components/GlobalPlayer.vue";
import { loadFiles } from "./store/localFiles";
import { currentTheme } from "./store/user"; // Hook into your global theme system

onMounted(() => {
	loadFiles();
});
</script>

<template>
	<!-- The theme's background and base text colors are applied here globally -->
	<div
		:class="[
			'min-h-screen transition-colors duration-300',
			currentTheme.bg,
			currentTheme.text,
		]"
	>
		<!-- Your pages (MainLayout, Sidebar, Profile, etc.) render here -->
		<RouterView />

		<!-- Your audio/video bar stays perfectly positioned over the theme background -->
		<GlobalPlayer />
	</div>
</template>
