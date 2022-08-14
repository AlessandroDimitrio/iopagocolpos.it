<template>
  <div class="h-screen antialiased">
    <div class="bg-blue-grey-700">
      <p class="py-2 mx-auto text-sm font-semibold text-center text-white">Ciao! Questo progetto è ancora in via di sviluppo. Puoi sostenerci segnalando errori o idee e <a href="">facendo una donazione per sostanere le spese</a></p>
    </div>
    <transition name="fade" appear>
      <div class="fixed inset-x-0 z-40 w-full h-full bg-black bg-opacity-50" v-show="showModal" @click="showModal = false"></div>
    </transition>
    <transition name="pop" appear>
      <div class="absolute inset-x-0 z-50 max-w-md p-10 mx-5 bg-white shadow-lg rounded-2xl top-20 modal sm:mx-auto" v-show="showModal">
        <div class="flex items-center w-12 h-12 mb-2 rounded-2xl bg-gradient-to-tr from-white to-blue-grey-600">
          <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto text-white" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </div>
        <h3 class="text-2xl font-bold text-gray-800">Segnala attività</h3>
        <p class="mt-1 text-sm font-medium leading-tight text-gray-500">
          Questo modulo serve per inoltrare la segnalazione di mancato uso del
          POS. E' possibile aggiungere l'attività attraverso il modulo di
          ricerca Google
        </p>
        <p class="mt-4 text-sm font-semibold">Cerca attività</p>
        <input id="modalMapSearchBox" type="text" placeholder="Cerca attività" class="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none" />
        <template v-if="formattedSelectedActivity && formattedSelectedActivity.name">
          <p class="mt-4 text-sm font-semibold">Stai segnalando:</p>
          <div class="flex flex-col w-full p-4 mt-4 bg-blue-grey-50 rounded-2xl">
            <h2 class="text-base font-bold leading-none text-gray-800">{{ formattedSelectedActivity.name }}</h2>
            <h3 class="mt-1 text-sm font-semibold leading-none text-gray-400">{{ formattedSelectedActivity.address }}</h3>
          </div>
          <p class="mt-4 text-sm font-semibold">Commento</p>
          <textarea type="text" v-model="notes" placeholder="Allega un commento (opzionale)" class="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none"></textarea>
          <p class="mt-4 text-sm font-semibold">E-mail</p>
          <input id="email-conferma" v-model="email" type="text" placeholder="Email" class="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none" />
          <p class="mt-1 mb-10 text-sm font-medium leading-tight text-gray-500">
            L'email serve esclusivamente a scopo di verifica per scartare segnalazioni fraudolente, non sarà visibile pubblicamente.
            <br />
            <br />
            <b>Riceverai una mail di conferma.</b>
          </p>
          <div class="flex flex-row mt-4 mb-4 space-x-2">
            <button @click="postReview" class="py-2 font-semibold text-white rounded-md bg-blue-grey-600 px-7">
              Inoltra
            </button>
            <button @click="showModal = false" class="px-5 py-2 font-semibold text-gray-800 border border-gray-200 rounded-md">
              Annulla
            </button>
          </div>
        </template>

        <template v-else>
          <p class="mt-4 text-sm font-semibold text-red-600">Cerca un'attività per continuare.</p>
        </template>
      </div>
    </transition>

    <header class="flex flex-col items-start justify-between px-5 py-10 bg-white border-b border-gray-200 sm:py-5 sm:flex-row sm:items-center">
      <div class="flex flex-row items-center space-x-10">
        <img class="h-16" src="/pos_logo.svg" alt="" />
        <div class="hidden space-x-5 font-semibold sm:flex">
          <a class="hover:text-blue-grey-500 hover:underline" href="">Mappa</a>
          <a class="hover:text-blue-grey-500 hover:underline" href="">L'obbiettivo</a>
          <a class="hover:text-blue-grey-500 hover:underline" href="">Sostienici</a>
        </div>
      </div>
      <div class="flex-row items-center hidden space-x-4 sm:flex">
        <button @click="showModal = !showModal" class="flex flex-row items-center py-3 space-x-3 font-semibold text-white transition duration-200 border-t rounded-md bg-blue-grey-700 border-blue-grey-400 hover:bg-blue-grey-900 px-7 focus:ring-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8"></path>
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
            <path d="M19 16v6"></path>
            <path d="M16 19h6"></path>
          </svg>
          <p>Segnala</p>
        </button>
      </div>
    </header>
    
    <section class="flex flex-row justify-between py-4 mx-3 bg-white border-t border-b border-gray-200 sm:hidden">
                      <button @click="showModal = !showModal" class="flex flex-row items-center py-3 space-x-3 font-semibold text-white transition duration-200 border-t rounded-md bg-blue-grey-600 border-blue-grey-400 hover:bg-blue-grey-700 px-7 focus:ring-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8"></path>
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
            <path d="M19 16v6"></path>
            <path d="M16 19h6"></path>
          </svg>
          <p>Segnala</p>
        </button>
        <button v-show="!mapToggle" @click="mapToggle = true; listToggle = false" class="flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon>
  <line x1="9" y1="3" x2="9" y2="18"></line>
  <line x1="15" y1="6" x2="15" y2="21"></line>
</svg>
          <p>Mostra mappa</p>
        </button>
        <button v-show="mapToggle" class="flex items-center space-x-2" @click="mapToggle = false; listToggle = true">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <rect x="3" y="14" width="7" height="7"></rect>
  <rect x="3" y="3" width="7" height="7"></rect>
  <line x1="14" y1="4" x2="21" y2="4"></line>
  <line x1="14" y1="9" x2="21" y2="9"></line>
  <line x1="14" y1="15" x2="21" y2="15"></line>
  <line x1="14" y1="20" x2="21" y2="20"></line>
</svg>
          <p>Mostra lista</p>
        </button>
    </section>
    <div class="flex flex-row h-screen">
      <StoreList v-show="listToggle" :isLoading="isLoading" :places="places" @search="search" @selected="currentPlace = $event" :currentPlace="currentPlace"></StoreList>
      <div v-show="mapToggle" class="flex items-center justify-center w-full h-full bg-gray-50">
        <GmapMap :center="center" ref="mapRef" :options="{disableDefaultUI:true}" :zoom="17" :streetViewControl="false" map-type-id="roadmap" style="width: 100%; height: 100%">
          <GmapMarker key="user-location" :icon="require('@/static/markers/user-location.svg')" :position="center" draggable @dragend="gMapFunc($event.latLng)" />
          <GmapMarker v-for="place in places" :key="place.google_id" :icon="markerIcon(place.google_id)" :position="{ lat: parseFloat(place.latitude), lng: parseFloat(place.longitude) }" @click="currentPlace = place" />
        </GmapMap>
      </div>
    </div>
  </div>
</template>

<script>
import { gmapApi } from "vue2-google-maps";

const server_url = "https://plankton-app-p6yje.ondigitalocean.app";

export default {
  name: "Home",
  data() {
    return {
      center: { lat: 0, lng: 0 },
      myMap: null,
      defaultQuery: "shop, food, restaurants",
      showModal: false,
      currentPlace: {},
      place: "",
      places: [],
      isLoading: false,
      // input new review
      email: "",
      notes: "",
      selectedActivity: null,
      mapToggle: false,
      listToggle: true,
      isOnMobile: false,
    };
  },

  mounted: function() {
      let pageWidth = window.innerWidth;
      if(pageWidth > 660){
        this.mapToggle = true;
        this.isOnMobile = true;
      } else {
        this.mapToggle = false;
      }
      this.geolocation();
  },
  watch: {
    center(newVal) {
      console.log("NUOVA POSIZIONE:", newVal);
      const defaultBounds = {
        north: newVal.lat + 0.05,
        south: newVal.lat - 0.05,
        east: newVal.lng + 0.05,
        west: newVal.lng - 0.05,
      };
      if (this.autocomplete) this.autocomplete.setBounds(defaultBounds);
    },
    google(newVal) {
      if (newVal) {
        console.log("GOOGLE OK:", newVal);

        // Create a bounding box with sides ~10km away from the center point
        const defaultBounds = {
          north: this.center.lat + 0.05,
          south: this.center.lat - 0.05,
          east: this.center.lng + 0.05,
          west: this.center.lng - 0.05,
        };

        const options = {
          bounds: defaultBounds,
          componentRestrictions: { country: "it" },
          fields: ["address_components", "geometry", "icon", "name"],
          types: ["establishment"],
          strictBounds: false,
        };

        var input = document.getElementById("mapSearchBox");
        this.autocomplete = new this.google.maps.places.Autocomplete(input, options);
        this.autocomplete.addListener("places_changed", this.search);

        var modalInput = document.getElementById("modalMapSearchBox");
        this.modalAutocomplete = new this.google.maps.places.SearchBox(modalInput, options);
        this.modalAutocomplete.addListener("places_changed", this.modalSearch);

        let self = this;
        this.$refs.mapRef.$mapPromise.then((map) => {
          self.myMap = map;
          self.google.maps.event.addListener(map, 'dragend', function() { console.log('map dragged'); self.fetchActivities()} );
          self.google.maps.event.addListener(map, 'zoom_changed', function() { console.log('map zoomed'); self.fetchActivities() } );
          console.log("GOOGLE-MAP OK:", self.myMap);
          self.search();
        });
      }
    },

    currentPlace(newVal) {
      this.myMap.panTo(new google.maps.LatLng(newVal.latitude, newVal.longitude));
    },
  },

  computed: {
    google: gmapApi,
    mapBounds() {
      if (this && this.myMap) return this.myMap.getBounds();
      return null;
    },
    formattedSelectedActivity() {
      if (this.selectedActivity === null || !this.selectedActivity.hasOwnProperty("name") || !this.selectedActivity.hasOwnProperty("formatted_address")) return null;
      const latitude = this.selectedActivity.geometry.location.lat();
      const longitude = this.selectedActivity.geometry.location.lng();
      return {
        id: this.selectedActivity.reference,
        name: this.selectedActivity.name,
        address: this.selectedActivity.formatted_address,
        type: this.selectedActivity.types,
        latitude,
        longitude
      }
    }
  },

  methods: {
    geolocation : function() {
      navigator.geolocation.getCurrentPosition((position) => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        this.myMap.setCenter(this.center);
      });
    },
    callback(results, status) {
      this.isLoading = false;
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        var bounds = new google.maps.LatLngBounds();
        let place = results[0];
        this.selectedActivity = place;

        if (place.geometry.viewport) {
          this.myMap.fitBounds(place.geometry.viewport);
        } else {
          this.myMap.setCenter(place.geometry.location);
          this.myMap.setZoom(17);
        }

        this.fetchActivities();
      }
    },
    modalSearch() {
      const searchText = document.getElementById("modalMapSearchBox").value;

      if (this.google && this.myMap) {
        const query = searchText ? searchText : this.defaultQuery;

        const request = {
          location: this.center,
          radius: "30",
          query: query,
        };

        let service = new this.google.maps.places.PlacesService(this.myMap);
        service.textSearch(request, this.callback);
      }
    },

    search() {
      this.isLoading = true;
      const searchText = document.getElementById("mapSearchBox").value;

      if (this.google && this.myMap) {
        const query = searchText ? searchText : this.defaultQuery;

        const request = {
          location: this.center,
          radius: "30",
          query: query,
        };

        let service = new this.google.maps.places.PlacesService(this.myMap);
        service.textSearch(request, this.callback);
      }
    },

    postReview() {
      let self = this;
      this.$axios.$post(`${server_url}/review`, {
        data: {
          email: self.email,
          notes: self.notes,
          activity: self.formattedSelectedActivity
        }
      }).then(response => console.log(response)).catch(err => console.error(err))

    },

    fetchActivities() {
      let self = this;
      var bounds = this.myMap.getBounds();
      var north = bounds.getNorthEast().lat();
      var east = bounds.getNorthEast().lng();
      var west = bounds.getSouthWest().lng();
      var south = bounds.getSouthWest().lat();
      this.$axios.$get(`${server_url}/activity`, {
        params: {
          north: north,
          east: east,
          west: west,
          south: south,
        }
      }).then(response => console.log(self.places = response)).catch(err => console.error(err))
    },

    markerIcon(reference) {
      if (this.currentPlace.hasOwnProperty("google_id") && this.currentPlace.google_id == reference)
        return require("@/static/markers/marker-red.svg");
      return require("@/static/markers/marker-black.svg");
    },

    gMapFunc(evnt) { this.center = { lat: evnt.lat(), lng: evnt.lng() } }
  },
};
</script>

<style>
.GMap__Wrapper {
  width: 100% !important;
  height: 100% !important;
}
</style>