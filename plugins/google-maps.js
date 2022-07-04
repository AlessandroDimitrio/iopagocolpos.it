import Vue from "vue";
import * as VueGoogleMaps from "vue2-google-maps";

Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyBej98hWH1AyGo_IRQQaV5nst4aEwWHAqw",
    libraries: "places"
  }
});

// installComponents: true
