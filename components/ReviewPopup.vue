<template>
    <div class="absolute top-0 left-0 flex justify-center items-center h-full w-screen z-50">
        <div class="inset-x-0 max-w-md p-10 mx-5 bg-white shadow-lg rounded-2xl top-20 modal sm:mx-auto">
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
                    <button @click="$emit('close')" class="px-5 py-2 font-semibold text-gray-800 border border-gray-200 rounded-md">
                        Annulla
                    </button>
                </div>
            </template>

            <template v-else>
                <p class="mt-4 text-sm font-semibold text-red-600">Cerca un'attività per continuare.</p>
            </template>
        </div>
    </div>
</template>

<script>
let server_url = "https://plankton-app-p6yje.ondigitalocean.app";
// server_url = "http://localhost:3002";

export default {
    name: "ReviewPopup",
    props: ['google', 'myMap', 'center'],
    data() {
        return {
            modalAutocomplete: null,
            email: "",
            notes: "",
            selectedActivity: null,
        };
    },

    computed: {
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
    watch: {
        google(newVal) {
            if (newVal) {
                // Create a bounding box with sides ~10km away from the center point
                console.log("NEW FUCKING GOOGLE YEAH");
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
                var modalInput = document.getElementById("modalMapSearchBox");
                this.modalAutocomplete = new this.google.maps.places.SearchBox(modalInput, options);
                this.modalAutocomplete.addListener("places_changed", this.modalSearch);
            }
        },
    },
    methods: {
        callback(results, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                let place = results[0];
                this.selectedActivity = place;
                if (place.geometry.viewport) {
                    this.myMap.fitBounds(place.geometry.viewport);
                } else {
                    this.myMap.setCenter(place.geometry.location);
                    this.myMap.setZoom(17);
                }
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
        postReview() {
            let self = this;
            this.$axios.$post(`${server_url}/activity/review`, {
                email: self.email,
                notes: self.notes,
                activity: self.formattedSelectedActivity
            }).then(response => {
                if (response.error) alert(response.error)
                else { console.log(response); this.$emit('close') }

            }).catch(err => console.error(err))

        },
    }
};
</script>