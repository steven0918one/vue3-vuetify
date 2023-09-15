import {venuesRoutes} from "@/router/settingsRoutes/venuesRoutes";
import {usersRoutes} from "@/router/settingsRoutes/usersRoutes";
import {periodRoutes} from "@/router/settingsRoutes/periodRoutes";
export const settingsRoutes = [
  {
    path: "settings",
    component: () => import("@/views/SettingsView.vue"),
    redirect: {name: 'settings'},
    meta:{
      requiresAuth: true,
    },
    children: [
      {
        path: "",
        name: "settings",
        component: () => import("@/components/settings/SettingsList.vue"),
        children: [
          ...venuesRoutes,
          ...usersRoutes,
          ...periodRoutes
        ]
      },
    ],
  },
];
