export const venuesRoutes = [
  {
    path: "venues",
    name: "venues",
    component: () => import("@/components/settings/venues/Venues.vue"),
  },
  {
    path: "edit-venue",
    name: "edit-venue",
    component: () => import("@/components/settings/venues/VenueForm.vue"),
    beforeEnter: (to, from, next) => {
      if ( from.name !== 'venues') {
        next({name : 'venues', params: {locale: to.params.locale}})
      } else {
        next()
      }
    },
  },
  {
    path: "create-venue",
    name: "create venue",
    component: () => import("@/components/settings/venues/VenueForm.vue"),
  }
]
