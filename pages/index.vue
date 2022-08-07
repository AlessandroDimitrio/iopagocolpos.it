<template>
  <div class="h-screen antialiased">
    <div class="bg-teal-700">
        <p class="py-2 mx-auto text-sm font-semibold text-center text-white">Ciao! Questo progetto è ancora in via di sviluppo. Puoi sostenerci segnalando errori o idee e <a href="">facendo una donazione per sostanere le spese</a></p>
    </div>
    <transition name="fade" appear>
      <div
        class="fixed inset-x-0 z-40 w-full h-full bg-black bg-opacity-70"
        v-show="showModal"
        @click="showModal = false"
      ></div>
    </transition>
    <transition name="pop" appear>
      <div
        class="absolute inset-x-0 z-50 max-w-md p-10 mx-5 bg-white rounded-lg shadow-lg top-20 modal sm:mx-auto"
        v-show="showModal"
      >
        <div
          class="flex items-center w-12 h-12 mb-2 bg-gradient-to-tr from-teal-100 rounded-xl to-teal-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="mx-auto text-white"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </div>
        <h3 class="text-2xl font-extrabold tracking-tighter text-teal-800">Aggiungi attività</h3>
        <p class="mt-1 text-sm font-medium leading-tight text-blue-grey-500">
          Questo modulo serve per inoltrare la segnalazione di mancato uso del
          POS. E' possibile aggiungere l'attività attraverso il modulo di
          ricerca Google
        </p>
        <p class="mt-4 text-sm">Attività</p>
        <input
          id="modalMapSearchBox"
          type="text"
          placeholder="Cerca attività"
          class="w-full p-4 mt-1 border rounded-lg border-blue-grey-300 focus:outline-none"
        />
        <p class="mt-4 text-sm">Commento</p>
        <textarea
          type="text"
          placeholder="Allega un commento (opzionale)"
          class="w-full p-4 mt-1 border rounded-lg border-blue-grey-300 focus:outline-none"
        ></textarea>
        <p class="mt-4 text-sm">E-mail</p>
        <input
          id="email-conferma"
          type="text"
          placeholder="Cerca attività"
          class="w-full p-4 mt-1 border rounded-lg border-blue-grey-300 focus:outline-none"
        />
        <p class="mt-1 mb-4 text-sm font-medium leading-tight text-blue-grey-500">
L'email serve per autenticare la segnalazione e far si che questa sia univoca.
        </p>
        <div class="flex flex-row mt-4 mb-4 space-x-2">
          <button
          @click="submitPlace"
            class="py-2 font-semibold text-white bg-teal-600 rounded-md px-7"
          >
            Inoltra
          </button>
          <button
          @click="showModal = false"
            class="px-5 py-2 font-semibold border rounded-md border-blue-grey-200 text-blue-grey-800"
          >
            Annulla
          </button>
        </div>
      </div>
    </transition>

    <div
      class="flex flex-col items-start justify-between px-5 py-10 bg-white border-b sm:py-5 border-blue-grey-300 sm:flex-row sm:items-center"
    >
      <div class="flex flex-row items-center space-x-10">
        <img class="h-16" src="/pos_logo.svg" alt="" />
      </div>
      <div class="flex flex-row items-center space-x-4">
        <button
          @click="showModal = !showModal"
          class="flex flex-row items-center py-3 space-x-3 font-semibold text-white bg-teal-600 border-t border-teal-400 rounded-md px-7 focus:ring-4"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
          <p>Segnala</p>
        </button>
      </div>
      <!-- <DonateButton></DonateButton> -->
      <!-- <button class="px-6 py-2 mt-2 font-medium text-white bg-black rounded-lg sm:mt-0" @click="showModal = true">Contribuisci</button> -->
    </div>
    <div class="flex flex-row h-screen">
      <StoreList
        :isLoading="isLoading"
        :places="places"
        @search="search"
        @selected="currentPlace = $event"
        :currentPlace="currentPlace"
      ></StoreList>
      <div class="flex items-center justify-center w-full h-full bg-blue-grey-50">
        <GmapMap
          ref="mapRef"
          :center="{ lat: 41.89422107929427, lng: 12.436617991051996 }"
          :zoom="15"
          :streetViewControl= "false"
          map-type-id="roadmap"
          style="width: 100%; height: 100%"
        >
          <GmapMarker
            key="user-location"
            :icon="require('@/static/markers/user-location.svg')"
            :position="center"
            draggable
            @dragend="gMapFunc($event.latLng)"
          />
          <GmapMarker
            v-for="place in places"
            :key="place.reference"
            :icon="markerIcon(place.reference)"
            :position="{
              lat: parseFloat(place.location.lat),
              lng: parseFloat(place.location.lng),
            }"
            @click="currentPlace = place"
          />
        </GmapMap>
        <!-- 
                <GMap class="w-full h-full" ref="gMap" language="it" :center="{ lat: 41.89422107929427, lng: 12.436617991051996 }" :options="{ fullscreenControl: false }" :zoom="15">
                </GMap>
                -->
      </div>
    </div>
  </div>
</template>

<script>
import { gmapApi } from "vue2-google-maps";

export default {
  name: "IndexPage",
  data() {
    return {
      center: { lat: 41.89422107929427, lng: 12.436617991051996 },
      myMap: null,
      defaultQuery: "shop, food, restarurants",
      searchAutocomplete: null,
      showModal: false,
      currentPlace: {},
      submittingPlace: {},
      place: "",
      places: [],
      isLoading: false,
      clusterStyle: [
        {
          url: "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m1.png",
          width: 56,
          height: 56,
          textColor: "#fff",
        },
      ],
    };
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
          strictBounds: false,
        };

        var input = document.getElementById("mapSearchBox");
        this.autocomplete = new this.google.maps.places.SearchBox(
          input,
          options
        );
        this.autocomplete.addListener("places_changed", this.search);

        var input2 = document.getElementById("modalMapSearchBox");
        this.modalAutocomplete = new this.google.maps.places.SearchBox(
          input2,
          options
        );
        this.modalAutocomplete.addListener("places_changed", this.modalSearch);

        let self = this;
        this.$refs.mapRef.$mapPromise.then((map) => {
          self.myMap = map;
          console.log("GOOGLE-MAP OK:", self.myMap);
          self.search();
        });
      }
    },

    currentPlace(newVal) {
      console.log("NEW CURRENT_PLACE:", newVal);
      this.myMap.panTo(
        new google.maps.LatLng(newVal.location.lat, newVal.location.lng)
      );
    },
  },

  computed: {
    google: gmapApi,
    mapBounds() {
      if (this && this.myMap) return this.myMap.getBounds();
      return null;
    },
  },

  methods: {
    submitPlace() {
      // WARNING: For POST requests, body is set to null by browsers.

      var xhr = new XMLHttpRequest();
      xhr.withCredentials = true;

        var fd = new FormData();
        fd.append("UsesPos", false);
        fd.append("AuthorId", 'user13');  
        fd.append("ShopId", 'le');
        fd.append("Comment", '');
        fd.append("Reason", '');

      xhr.open(
        "POST",
        "https://xe06rlm820.execute-api.eu-west-1.amazonaws.com/dev/review"
      );

      xhr.send(fd);
    },
    callback(results, status) {
      this.isLoading = false;
      console.log(this);
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        var bounds = new google.maps.LatLngBounds();
        this.places = [];

        for (var i = 0; i < results.length; i++) {
          let temp = results[i];
          var place = {};
          place.reference = temp.reference;
          place.name = temp.name;
          place.types = temp.types;
          place.address = temp.formatted_address;
          console.log(temp);
          //place.openNow = temp.opening_hours.open_now;

          place.lastReport = parseInt(Math.random() * 10 + 3) + " minuti";
          place.pos = parseInt(Math.random() * Math.random() * 100);
          place.noPos = parseInt(Math.random() * Math.random() * 100);

          place.location = {
            lat: temp.geometry.location.lat(),
            lng: temp.geometry.location.lng(),
          };

          //Recursively loop through your coordinate list
          const latLng = new google.maps.LatLng(
            temp.geometry.location.lat(),
            temp.geometry.location.lng()
          );
          bounds.extend(latLng);

          this.places.push(place);
        }
        this.myMap.fitBounds(bounds);
        console.log(this.places);
      }
    },
    modalSearch() {
      const searchText = document.getElementById("modalMapSearchBox").value;
      console.log("HAI CERCATO QUALCOSA:", searchText);

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
      console.log("HAI CERCATO QUALCOSA:", searchText);

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

    markerIcon(reference) {
      if (
        this.currentPlace.hasOwnProperty("reference") &&
        this.currentPlace.reference == reference
      )
        return require("@/static/markers/marker-red.svg");
      return require("@/static/markers/marker-black.svg");
    },

    gMapFunc(evnt) {
      this.center = { lat: evnt.lat(), lng: evnt.lng() };
    },
  },
};
</script>

<style>
.GMap__Wrapper {
  width: 100% !important;
  height: 100% !important;
}
</style>