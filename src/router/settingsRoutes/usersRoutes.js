export const usersRoutes = [
  {
    path: "users",
    name: "users",
    component: () => import("@/components/settings/users/Users.vue"),
  },
  {
    path: "invite-users",
    name: "invite-users",
    component: () => import("@/components/settings/users/UserInvite.vue"),
  }
]
