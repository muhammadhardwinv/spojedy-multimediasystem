/** @format */

import { createRouter, createWebHistory } from "vue-router";

import MainLayout from "../layouts/MainLayout.vue";

import HomeView from "../views/HomeView.vue";
import LocalView from "../views/LocalView.vue";
import SearchView from "../views/SearchView.vue";
import FavoriteView from "../views/FavoriteView.vue";
import TrendingView from "../views/TrendingView.vue";
import ShoppingView from "../views/ShoppingView.vue";
import CartView from "../views/CartView.vue";
import ProfileView from "../views/ProfileView.vue";
import PlayerView from "../views/PlayerView.vue";

const routes = [
	{
		path: "/",
		component: MainLayout,

		children: [
			{
				path: "",
				name: "Home",
				component: HomeView,

				meta: {
					title: "Home",
				},
			},

			{
				path: "local",
				name: "Local",
				component: LocalView,

				meta: {
					title: "Local Library",
				},
			},

			{
				path: "search",
				name: "Search",
				component: SearchView,

				meta: {
					title: "Search",
				},
			},

			{
				path: "favorite",
				name: "Favorite",
				component: FavoriteView,

				meta: {
					title: "Favorites",
				},
			},

			{
				path: "trending",
				name: "Trending",
				component: TrendingView,

				meta: {
					title: "Trending",
				},
			},

			{
				path: "shopping",
				name: "Shopping",
				component: ShoppingView,

				meta: {
					title: "Shopping",
				},
			},

			{
				path: "cart",
				name: "Cart",
				component: CartView,

				meta: {
					title: "Cart",
				},
			},

			{
				path: "profile",
				name: "Profile",
				component: ProfileView,

				meta: {
					title: "Profile",
				},
			},

			{
				path: "player",
				name: "Player",
				component: PlayerView,

				meta: {
					title: "Now Playing",
				},
			},
		],
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

/*
|--------------------------------------------------------------------------
| PAGE TITLE HANDLER
|--------------------------------------------------------------------------
*/

router.afterEach((to) => {
	document.title = to.meta.title ? `${to.meta.title} • Spojedy` : "Spojedy";
});

export default router;
