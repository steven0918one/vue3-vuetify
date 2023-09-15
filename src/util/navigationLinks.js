export const navigationLinks = [
  {
    title: "dashboard",
    roles: "all",
    route: "dashboard",
    children: []
  },
  {
    title: "settings",
    roles: "all",
    route: "settings",
    children: [
      {
        title: "venues",
        roles: "all",
        route: "venues",
      },
      {
        title: "users",
        roles: "all",
        icon: "mdi-cog-outline",
        route: "users",
      },
      {
        title: "period",
        roles: "all",
        icon: "mdi-calendar-range",
        route: "period",
      },
    ],
  },
  // {
  //   title: "sales",
  //   roles: "all",
  //   icon: "mdi-cog-outline",
  //   route: "sales",
  //   children: [
  //     {
  //       title: "sales1",
  //       roles: "all",
  //       icon: "mdi-cog-outline",
  //       children: [],
  //     },
  //     {
  //       title: "sales2",
  //       roles: "all",
  //       icon: "mdi-cog-outline",
  //       children: [],
  //     },
  //     {
  //       title: "sales3",
  //       roles: "all",
  //       icon: "mdi-cog-outline",
  //       children: [],
  //     },
  //   ],
  // },
];

export const userProfileSettingsMenu = [
  { title: "My Profile", icon: "mdi-account" },
  { title: "Messages", icon: "mdi-message-text" },
  { title: "Task Management", icon: "mdi-format-list-checks" },
  { title: "Settings", icon: "mdi-cog-outline", route: "settings" },
  { title: "Logout", icon: "mdi-logout", route: "logout" },
];

export const settingsLinks = [
  {
    title: "venues",
    roles: "all",
    icon: "mdi-map-marker",
    children: [],
    route: "venues",
  },
  {
    title: "period",
    roles: "all",
    icon: "mdi-calendar-range",
    children: [],
    route: "period",
  },
  {
    title: "users",
    roles: "all",
    icon: "mdi-account-supervisor",
    children: [],
    route: "users",
  },
]
