import { createWebHistory, createRouter } from "vue-router";
import Game from "../components/game/Game.vue";
import NewGame from "../components/game/NewGame.vue";
import LocalGame from "../components/game/LocalGame.vue";


const routes = [
    {
        path: "/game/:token",
        name: "Game",
        component: Game,
    },
    {
        path: "/localGame",
        name: "LocalGame",
        component: LocalGame,
    },
    {
        path: "/",
        name: "NewGame",
        component: NewGame,
    }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;