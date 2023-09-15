/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { VDataTable } from 'vuetify/labs/VDataTable';


// Composables
import { createVuetify } from 'vuetify'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    themes: {
      light: {
        colors: {
          primary: '#4374BD',
          primaryLight: '#63C9CD',
          secondary: '#5CBBF6',
          orange: "#EA8435",
          astraDark: '#1F2A35',
          astraGray: '#6D747C',
          astraLightGray: '#4B545D',
          astraNavColor: '#2A8387',
          astraActiveNav: '#3CBCC1',
          astraBg: '#FBFCFC',
          astraBlue: '#4374BD',
          error: '#B6334B',
          navy600: '#6D747C',
          navy400: '#C4C7CA',
          navy100: '#FBFCFC',
        },
      },
    },
  },
  defaults: {
    global: {
      ripple: false,
    },
    VTextField: {
      variant: 'outlined',
      color: 'grey-lighten-1',
      baseColor: 'grey-darken-2',
      focused: true,
      class: 'astra-input',
      density: 'comfortable'
    },
  },
  components: {
    VDataTable,
  },
})
