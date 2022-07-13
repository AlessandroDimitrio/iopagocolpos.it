<template>
  <div class="antialiased h-screen">
    <div class="bg-teal-700">
        <p class="mx-auto text-white py-2 font-semibold text-sm text-center">Ciao! Questo progetto è ancora in via di sviluppo. Puoi sostenerci segnalando errori o idee e <a href="">facendo una donazione per sostanere le spese</a></p>
    </div>
    <transition name="fade" appear>
      <div
        class="fixed inset-x-0 w-full h-full z-40 bg-black bg-opacity-70"
        v-show="showModal"
        @click="showModal = false"
      ></div>
    </transition>
    <transition name="pop" appear>
      <div
        class="
          top-20
          modal
          z-50
          mx-5
          sm:mx-auto
          absolute
          max-w-md
          shadow-lg
          inset-x-0
          p-10
          bg-white
          rounded-lg
        "
        v-show="showModal"
      >
        <div
          class="
            bg-gradient-to-tr
            from-teal-100
            rounded-xl
            mb-2
            to-teal-600
            w-12
            h-12
            flex
            items-center
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="text-white mx-auto"
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
        <h3 class="font-extrabold text-2xl tracking-tighter text-teal-800">Aggiungi attività</h3>
        <p class="text-blue-grey-500 leading-tight font-medium mt-1 text-sm">
          Questo modulo serve per inoltrare la segnalazione di mancato uso del
          POS. E' possibile aggiungere l'attività attraverso il modulo di
          ricerca Google
        </p>
        <p class="text-sm mt-4">Attività</p>
        <input
          id="modalMapSearchBox"
          type="text"
          placeholder="Cerca attività"
          class="
            border border-blue-grey-300
            focus:outline-none
            rounded-lg
            p-4
            w-full
            mt-1
          "
        />
        <p class="text-sm mt-4">Commento</p>
        <textarea
          type="text"
          placeholder="Allega un commento (opzionale)"
          class="
            border border-blue-grey-300
            focus:outline-none
            rounded-lg
            p-4
            w-full
            mt-1
          "
        ></textarea>
        <div class="flex flex-row space-x-2 mt-4">
          <button
          @click="submitPlace"
            class="bg-teal-600 font-semibold text-white px-7 py-2 rounded-md"
          >
            Inoltra
          </button>
          <button
          @click="showModal = false"
            class="
              border border-blue-grey-200
              font-semibold
              text-blue-grey-800
              px-5
              py-2
              rounded-md
            "
          >
            Annulla
          </button>
        </div>
      </div>
    </transition>

    <div
      class="
        px-5
        py-10
        sm:py-5
        bg-white
        border-b border-blue-grey-300
        justify-between
        flex flex-col
        sm:flex-row
        items-start
        sm:items-center
      "
    >
      <div class="flex flex-row items-center space-x-10">
        <img class="h-16" src="/pos_logo.svg" alt="" />
      </div>
      <div class="flex flex-row items-center space-x-4">
        <button
          @click="showModal = !showModal"
          class="
            bg-teal-600
            border-t
            flex flex-row
            items-center
            space-x-3
            border-teal-400
            font-semibold
            text-white
            px-7
            py-3
            rounded-md
            focus:ring-4
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
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
        <img
          class="h-12 w-12 rounded-md object-cover "
          src="https://images.unsplash.com/photo-1531891437562-4301cf35b7e4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2864&q=80"
          alt=""
        />
      </div>
      <!-- <DonateButton></DonateButton> -->
      <!-- <button class="mt-2 sm:mt-0 font-medium bg-black rounded-lg text-white px-6 py-2" @click="showModal = true">Contribuisci</button> -->
    </div>
    <div class="flex flex-row h-screen">
      <StoreList
        :isLoading="isLoading"
        :places="places"
        @search="search"
        @selected="currentPlace = $event"
        :currentPlace="currentPlace"
      ></StoreList>
      <div class="w-full h-full flex justify-center items-center bg-blue-grey-50">
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
                <GMap class="h-full w-full" ref="gMap" language="it" :center="{ lat: 41.89422107929427, lng: 12.436617991051996 }" :options="{ fullscreenControl: false }" :zoom="15">
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