import { createWebHistory, createRouter } from "vue-router";
//import Home from "@/components/Home.vue";
import Country from "@/components/Country.vue";

const routes = [
    {
        path: "/",
        name: "Country",
        component: Country,
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;