<template>
  <div class="h-screen antialiased">

    <transition name="fade" appear>
      <div
           class="fixed inset-x-0 z-40 w-full h-full bg-black bg-opacity-50"
           v-show="showModal"
           @click="showModal = false"></div>
    </transition>
    <transition name="pop" appear>
      <ReviewPopup @close="showModal = false" v-show="showModal && google && myMap" :google="google" :myMap="myMap" :center="center" />
    </transition>

    <Navbar />

    <section class="z-30 flex flex-row justify-between py-4 mx-3 bg-white border-t border-b border-gray-200 sm:hidden">

      <button v-show="!mapToggle" @click="mapToggle = true; listToggle = false;" class="flex items-center space-x-2 px-3">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon>
          <line x1="9" y1="3" x2="9" y2="18"></line>
          <line x1="15" y1="6" x2="15" y2="21"></line>
        </svg>
        <p>Mostra mappa</p>
      </button>

      <button v-show="mapToggle" class="flex items-center space-x-2 px-3" @click="mapToggle = false; listToggle = true;">
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

      <button @click="showModal = !showModal" class="flex flex-row items-center py-3 space-x-3 font-semibold text-white transition duration-200 border-t rounded-md bg-blue-grey-600 border-blue-grey-400 hover:bg-blue-grey-700 px-7 focus:ring-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8"></path>
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
          <path d="M19 16v6"></path>
          <path d="M16 19h6"></path>
        </svg>
        <p>Segnala</p>
      </button>

    </section>
    <div class="z-30 flex flex-row h-screen">
      <StoreList
                 v-show="listToggle"
                 :isLoading="isLoading"
                 :places="orderedPlaces"
                 @search="search"
                 @selected="currentPlace = $event"
                 :currentPlace="currentPlace"></StoreList>
      <div
           v-show="mapToggle"
           class="flex items-center justify-center w-full h-full bg-gray-50">
        <GmapMap
                 :center="center"
                 ref="mapRef"
                 :options="{ disableDefaultUI: true }"
                 :zoom="17"
                 :streetViewControl="false"
                 map-type-id="roadmap"
                 style="width: 100%; height: 100%">
          <GmapMarker
                      class="h-6"
                      key="user-location"
                      :icon="require('@/static/markers/user-location.svg')"
                      :position="center"
                      draggable
                      @dragend="gMapFunc($event.latLng)" />
          <GmapMarker
                      class="h-2"
                      v-for="place in orderedPlaces"
                      :key="place.google_id"
                      :icon="markerIcon(place.google_id)"
                      :position="{
                        lat: parseFloat(place.latitude),
                        lng: parseFloat(place.longitude),
                      }"
                      @click="currentPlace = place; openMarker(place._id)">
            <GmapInfoWindow
                            :closeclick="true"
                            @closeclick="openMarker(null)"
                            :opened="openedMarkerID === place._id">
              <div class="info-window">
                <p class="text-xl font-bold">{{ place.name }}</p>
              </div>
            </GmapInfoWindow>
          </GmapMarker>
        </GmapMap>
      </div>
    </div>
  </div>
</template>

<script>
import { gmapApi } from "vue2-google-maps";

let server_url = "https://plankton-app-p6yje.ondigitalocean.app";
server_url = "http://localhost:3002";
export default {
  name: "Home",
  data() {
    return {
      openedMarkerID: null,
      autocomplete: null,
      center: { lat: 0, lng: 0 },
      myMap: null,
      defaultQuery: "shop, food, restaurants",
      showModal: false,
      currentPlace: {},
      place: "",
      places: [],
      isLoading: false,
      mapToggle: false,
      listToggle: true,
      isOnMobile: false,
    };
  },

  mounted: function () {
    let pageWidth = window.innerWidth;
    if (pageWidth > 660) {
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
          fields: ["address_components", "geometry", "icon", "name", "photos"],
          types: ["establishment"],
          strictBounds: false,
        };

        var input = document.getElementById("mapSearchBox");
        this.autocomplete = new this.google.maps.places.Autocomplete(
          input,
          options
        );
        this.autocomplete.addListener("places_changed", this.search);

        let self = this;
        this.$refs.mapRef.$mapPromise.then((map) => {
          self.myMap = map;
          let style = [
            {
              featureType: "all",
              elementType: "labels.text",
              stylers: [
                {
                  color: "#878787",
                },
              ],
            },
            {
              featureType: "all",
              elementType: "labels.text.stroke",
              stylers: [
                {
                  visibility: "off",
                },
              ],
            },
            {
              featureType: "landscape",
              elementType: "all",
              stylers: [
                {
                  color: "#f9f5ed",
                },
              ],
            },
            {
              featureType: "road.highway",
              elementType: "all",
              stylers: [
                {
                  color: "#f5f5f5",
                },
              ],
            },
            {
              featureType: "road.highway",
              elementType: "geometry.stroke",
              stylers: [
                {
                  color: "#c9c9c9",
                },
              ],
            },
            {
              featureType: "water",
              elementType: "all",
              stylers: [
                {
                  color: "#aee0f4",
                },
              ],
            },
          ];
          self.myMap.set(
            "style",
            new google.maps.StyledMapType(style, { name: "My Style" })
          );
          self.google.maps.event.addListener(map, "dragend", function () {
            console.log("map dragged");
            self.fetchActivities();
          });
          self.google.maps.event.addListener(map, "zoom_changed", function () {
            console.log("map zoomed");
            self.fetchActivities();
          });
          console.log("GOOGLE-MAP OK:", self.myMap);
          self.search();
          setTimeout(function () {
            self.fetchActivities();
          }, 2000)
        });
      }
    },

    currentPlace(newVal) {
      this.myMap.panTo(
        new google.maps.LatLng(newVal.latitude, newVal.longitude)
      );
    },
  },

  computed: {
    google: gmapApi,
    mapBounds() {
      if (this && this.myMap) return this.myMap.getBounds();
      return null;
    },
    orderedPlaces() {
      function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
        var R = 6371; // Radius of the earth in km
        var dLat = deg2rad(lat2 - lat1); // deg2rad below
        var dLon = deg2rad(lon2 - lon1);
        var a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(deg2rad(lat1)) *
          Math.cos(deg2rad(lat2)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km
        d = parseInt(d * 1000);
        return d / 1000;
      }

      function deg2rad(deg) {
        return deg * (Math.PI / 180);
      }

      let ordPlcs = [];
      for (const i in this.places) {
        const place = this.places[i];
        const distance = parseFloat(
          getDistanceFromLatLonInKm(
            place.latitude,
            place.longitude,
            this.center.lat,
            this.center.lng
          )
        );
        ordPlcs[i] = {
          ...place,
          distance: distance,
        };
      }

      return ordPlcs.sort((a, b) => a.distance - b.distance);
    },
  },

  methods: {
    geolocation: function () {
      navigator.geolocation.getCurrentPosition((position) => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        this.myMap.setCenter(this.center);
      });
    },
    openMarker(id) {
      this.openedMarkerID = id
    },
    callback(results, status) {
      this.isLoading = false;
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        var bounds = new google.maps.LatLngBounds();
        let place = results[0];
        if (place.geometry.viewport) {
          this.myMap.fitBounds(place.geometry.viewport);
        } else {
          this.myMap.setCenter(place.geometry.location);
          this.myMap.setZoom(17);
        }
        this.fetchActivities();
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

    fetchActivities() {
      let self = this;
      var bounds = this.myMap.getBounds();
      var north = bounds.getNorthEast().lat();
      var east = bounds.getNorthEast().lng();
      var west = bounds.getSouthWest().lng();
      var south = bounds.getSouthWest().lat();
      this.$axios
        .$get(`${server_url}/activity/reviews`, {
          params: {
            north: north,
            east: east,
            west: west,
            south: south,
          },
        })
        .then((response) => console.log((self.places = response)))
        .catch((err) => console.error(err));
    },

    markerIcon(reference) {
      if (
        this.currentPlace.hasOwnProperty("google_id") &&
        this.currentPlace.google_id == reference
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