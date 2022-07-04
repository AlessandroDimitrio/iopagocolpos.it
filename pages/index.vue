<template>
    <div class="antialiased h-screen">
        <transition name="fade" appear>
            <div class="fixed inset-x-0 w-full h-full z-40 bg-black bg-opacity-70" v-if="showModal" @click="showModal = false"></div>
        </transition>
        <transition name="pop" appear>
            <div class="top-20 modal z-50 mx-5 sm:mx-auto absolute max-w-md shadow-lg inset-x-0 p-10 bg-white rounded-lg" v-if="showModal">
                <h3 class="font-extrabold text-3xl mont">Aggiungi attività</h3>
                <p class="text-gray-500 leading-tight mt-1">E' possibile aggiungere l'attività attraverso il modulo di ricerca Google</p>
                <input type="text" placeholder="Cerca attività" class="border border-gray-300 shadow-sm focus:outline-none rounded-lg px-6 py-3 mt-10">
            </div>
        </transition>

        <div class="px-5 py-10 sm:py-5 bg-white border-b border-gray-300 justify-between flex flex-col sm:flex-row items-start sm:items-center">
            <div class="flex flex-row items-center space-x-10">
                <img class="h-16" src="/pos_logo.svg" alt="">
                <p class="text-sm text-gray-500 w-1/3">Il portale per segnalare attività che non accettano pagamenti con carta</p>
            </div>
            <DonateButton></DonateButton>
            <!-- <button class="mt-2 sm:mt-0 font-medium bg-black rounded-lg text-white px-6 py-2" @click="showModal = true">Contribuisci</button> -->
        </div>
        <div class="flex flex-row h-screen">
            <StoreList :isLoading="isLoading" :places="places" @search="search" @selected="currentPlace = $event" :currentPlace="currentPlace"></StoreList>
            <div class="w-full h-full flex justify-center items-center bg-gray-50">
                <GmapMap ref="mapRef" :center="{ lat: 41.89422107929427, lng: 12.436617991051996 }" :zoom="15" map-type-id="roadmap" style="width: 100%; height: 100%">
                    <GmapMarker key="user-location" :icon="require('@/static/markers/user-location.svg')" :position="center" draggable @dragend="gMapFunc($event.latLng)" />
                    <GmapMarker v-for="place in places" :key="place.reference" :icon="markerIcon(place.reference)" :position="{ lat: parseFloat(place.location.lat), lng: parseFloat(place.location.lng) }" @click="currentPlace = place" />
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

import { gmapApi } from 'vue2-google-maps';

export default {
    name: 'IndexPage',
    data() {
        return {
            center: { lat: 41.89422107929427, lng: 12.436617991051996 },
            myMap: null,
            defaultQuery: 'shop, food, restarurants',
            searchAutocomplete: null,
            showModal: false,
            currentPlace: {},
            place: "",
            places: [],
            isLoading: false,
            clusterStyle: [
                {
                    url: "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m1.png",
                    width: 56,
                    height: 56,
                    textColor: "#fff"
                }
            ],

        }
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
            if (this.autocomplete)
                this.autocomplete.setBounds(defaultBounds);
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
                    strictBounds: false
                };

                var input = document.getElementById('mapSearchBox');
                this.autocomplete = new this.google.maps.places.SearchBox(input, options);
                this.autocomplete.addListener("places_changed", this.search)

                let self = this;
                this.$refs.mapRef.$mapPromise.then((map) => {
                    self.myMap = map;
                    console.log("GOOGLE-MAP OK:", self.myMap);
                    self.search();
                })
            }
        },

        currentPlace(newVal) {
            console.log("NEW CURRENT_PLACE:", newVal);
            this.myMap.panTo(new google.maps.LatLng(newVal.location.lat, newVal.location.lng))
        }
    },

    computed: {
        google: gmapApi,
        mapBounds() {
            if (this && this.myMap) return this.myMap.getBounds();
            return null;
        }
    },

    methods: {

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

                    place.location = { lat: temp.geometry.location.lat(), lng: temp.geometry.location.lng() };



                    //Recursively loop through your coordinate list
                    const latLng = new google.maps.LatLng(temp.geometry.location.lat(), temp.geometry.location.lng());
                    bounds.extend(latLng);

                    this.places.push(place);
                }
                this.myMap.fitBounds(bounds);
                console.log(this.places);
            }
        },

        search() {
            this.isLoading = true;
            const searchText = document.getElementById('mapSearchBox').value;
            console.log("HAI CERCATO QUALCOSA:", searchText);

            if (this.google && this.myMap) {

                const query = (searchText) ? searchText : this.defaultQuery;

                const request = {
                    location: this.center,
                    radius: '30',
                    query: query
                };

                let service = new this.google.maps.places.PlacesService(this.myMap);
                service.textSearch(request, this.callback);
            }
        },

        markerIcon(reference) {
            if (this.currentPlace.hasOwnProperty("reference") && this.currentPlace.reference == reference) return require('@/static/markers/marker-red.svg');
            return require('@/static/markers/marker-black.svg')
        },

        gMapFunc(evnt) {
            this.center = { "lat": evnt.lat(), "lng": evnt.lng() };
        }


    }

}
</script>

<style>
.GMap__Wrapper {
    width: 100% !important;
    height: 100% !important;
}
</style>