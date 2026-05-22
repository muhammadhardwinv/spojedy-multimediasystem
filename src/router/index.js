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
			{ path: "", name: "Home", component: HomeView },
			{ path: "local", name: "Local", component: LocalView },
			{ path: "search", name: "Search", component: SearchView },
			{ path: "favorite", name: "Favorite", component: FavoriteView },
			{ path: "trending", name: "Trending", component: TrendingView },
			{ path: "shopping", name: "Shopping", component: ShoppingView },
			{ path: "cart", name: "Cart", component: CartView },
			{ path: "profile", name: "Profile", component: ProfileView },
			{ path: "player", name: "Player", component: PlayerView },
		],
	},
];

export default createRouter({
	history: createWebHistory(),
	routes,
});
