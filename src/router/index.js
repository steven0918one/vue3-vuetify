// Composables
import { createRouter, createWebHistory, RouterView } from "vue-router";
import Tr from "@/util/translations";
import { getCookie } from "@/util/constants";
import { authRoutes } from "@/router/authRoutes";
import { settingsRoutes } from "@/router/settingsRoutes/settingsRoutes";

const routes = [
  {
    path: "/:locale?",
    component: RouterView,
    beforeEnter: Tr.routeMiddleware,
    meta: {
      requiresAuth: false,
    },
    children: [
      {
        path: "",
        name: "secureLayout",
        redirect: { name: "dashboard" },
        component: () => import("@/layouts/default/SecureLayout.vue"),
        children: [
          {
            path: "dashboard",
            name: "dashboard",
            component: () => import("@/views/DashboardView.vue"),
            meta: {
              requiresAuth: true,
            },
            children: [],
          },
          ...settingsRoutes,
        ],
      },
      ...authRoutes,
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: 'navlink-item-active'
});

// router guard
router.beforeEach((to, from, next) => {
  const jwtToken = getCookie("jwt");
  if (to.meta.requiresAuth && !jwtToken) {
    next({ name: "login", params: { locale: to.params.locale } });
  } else {
    next();
  }
});
export default router;
