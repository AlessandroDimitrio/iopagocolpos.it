<template>
    <div class="antialiased h-screen">
        <transition name="fade" appear>
            <div class="fixed inset-x-0 w-full h-full z-40 bg-black bg-opacity-70" v-if="showModal" @click="showModal = false"></div>
        </transition>
        <transition name="pop" appear>
            <div class="top-20 modal z-50 mx-5 sm:mx-auto absolute max-w-md shadow-lg inset-x-0 p-10 bg-white rounded-lg" v-if="showModal">
                <h3 class="font-extrabold text-3xl mont">Aggiungi attività</h3>
                <p class="text-gray-500 leading-tight mt-1">E' possibile aggiunger l'attività attraverso il modulo di ricerca Google</p>
                <input type="text" placeholder="Cerca attività" class="border border-gray-300 shadow-sm focus:outline-none rounded-lg px-6 py-3 mt-10">
            </div>
        </transition>

        <div class="px-5 py-10 sm:py-5 bg-white border-b border-gray-300 justify-between flex flex-col sm:flex-row items-start sm:items-center">
            <div>
                <p class="text-2xl font-extrabold mont">iopagocolpos.it</p>
                <p class="text-sm text-gray-500">Il portale per segnalare attività che non accettano pagamenti con carta</p>
            </div>
            <button class="mt-2 sm:mt-0 font-medium bg-black rounded-lg text-white px-6 py-2" @click="showModal = true">Contribuisci</button>
        </div>
        <div class="flex flex-row h-screen">
            <StoreList></StoreList>
            <div class="w-full h-full flex justify-center items-center bg-red-500">
                <GMap class="h-full w-full" ref="gMap" language="en" :cluster="{ options: { styles: clusterStyle } }" :center="{ lat: 41.89422107929427, lng: 12.436617991051996 }" :options="{ fullscreenControl: false, styles: mapStyle }" :zoom="15">
                    <GMapMarker v-for="place in locations" key="ChIJ2ZHWp3tgLxMRMRBVasaRNIksasd" :position="{ lat: 41.89422107929427, lng: 12.436617991051996 }" icon="https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/restaurant-71.png">
                    </GMapMarker>
                    <GMapMarker v-for="place in locations" :key="place.reference" :position="{ lat: parseFloat(place.location.lat), lng: parseFloat(place.location.lng) }" @click="currentLocation = place">

                    </GMapMarker>
                </GMap>
                <!--GMapInfoWindow :options="{ maxWidth: 200 }">
                            <code>
                                lat: {{ location.lat }},
                                lng: {{ location.lng }}
                            </!--code>
                        </GMapInfoWindow-->
            </div>
        </div>
    </div>
</template>

<script>
const mapsApiKey = "AIzaSyBej98hWH1AyGo_IRQQaV5nst4aEwWHAqw"; // Package: @nuxtjs/dotenv

import { ref, watch, reactive } from "vue";

export default {
    name: 'IndexPage',

    /* head() {
        return {
            script: [
                { src: `https://maps.googleapis.com/maps/api/js?key=${mapsApiKey}&libraries=places&callBack` }
            ]
        };
    }, */

    async mounted() {
        setTimeout(() => {

            var input = document.getElementById('mapSearchBox');
            const ok = new google.maps.places.Autocomplete(input);
            console.log(ok);

            console.log("GMAP:", this.$refs.gMap.map);

            let service = new google.maps.places.PlacesService(this.$refs.gMap.map);
            service.textSearch(this.request, this.callback);

        }, 3000);
    },

    setup() {
        const showModal = ref(false);
        console.log(mapsApiKey);

        const place = ref("");

        // locations

        const currentLocation = {};
        const circleOptions = {

        };

        const locations = reactive([
        ]);

        const pins = {
            selected:
                "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAHUSURBVHgB5VU7SwNBEJ7LmZBgMC+UdKKx0MZCG2srwcbCB2glpFDQ3to/IegvSAIWPrBJIySlipUKKqYLaHJ3iWIelzu/DTk8j71H7MQPltmZnflmZ3b3juivQ3BzCIfDI4FAYBvTRV3XR7tBglCCOIP9oFwuv/46QSwWWwfZIaaDNi7vGOlqtZqhfhPE4/EViAy5V6ljE8uVSuXYc4JkMjncarUeMR0ib5Db7fZEvV6vWBd8PG+Q73LIFYyj3lAsa1G/37/D4+JWgPbcQkybd9jpdGYVRXlmSiQSSYmieMWmhgMuwI0kSTPkpQJgzKJnDfJuKYryBJH7sVNBSPGI7BKoFl3n+GguMY4JHiz6GtoybiisRczmEtPFAM+Ifl6i5DmTKYqeX+Nssj19lUz9N2J4XNxDTiQSkwi4oz6ADU3hLdxb7dwW9RyL5B0FHrltAgZUsEce4eRrmwB3ugCRJ3fk4VvsOwEDHtcWxKeDy4emaWmHdRKdFpvNphQKhdhFmOet42D3sftTJw7X/wHgw/U8h1ywkJ/gYJeI/wi/g8kdmqqqG5Alk62Er+emG7nXBFSr1aroNSNknwOVzZnNS6xIHtFoNF6CweAbpheyLOfo3+ALfrSuzJ1F8EsAAAAASUVORK5CYII=",
            notSelected:
                "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABHElEQVR42uVVyw4BMRQdC98lsbPwG5YSH+BzWFtLZilh0oQgFh6J54IwBmGYtrfaBREdcTvDhpM0adrec3rb+7Csn8fRdrLg7VzBubhDzmHrudRuZ2KRs/miLd6AThfNaOTTGRFIsMm8bkSuXBeGoLVaGi0g39wLI4GTf1EjdE/+E1pAAGgEAenkb/tBo1vQFUDgBbSbny6al77uSQwB/6wJSNHoAo8xj30iaYMW4Lv9wfSTpc0eH6atXtE4TKWNUS4AY2hyddY4k/lwVEZncm9QilQuBGPwnp1B5GIXGi3P0eU0c7EqKrje5hU5d7fr2P2AEJIESkNqB1XJkvhI0/GrTuqZX619tLMF/VHlfnk5/0r7ZMvVWA3rr3AF6LIMZ7PmSlUAAAAASUVORK5CYII=",
        };

        const mapStyle = [];
        const clusterStyle = [
            {
                url: "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m1.png",
                width: 56,
                height: 56,
                textColor: "#fff"
            }
        ];



        // PLACES API SEARCH BY QUERY STRING
        const request = {
            location: { lat: 41.89422107929427, lng: 12.436617991051996 },
            radius: '500',
            query: 'restaurant'
        };

        const callback = (results, status) => {
            if (status == google.maps.places.PlacesServiceStatus.OK) {

                locations.value = [];

                for (var i = 0; i < results.length; i++) {
                    var place = results[i];
                    place.location = { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() };
                    locations.value.push(place);
                    console.log(place);
                    //createMarker(results[i]);
                }
            }
        }


        return {
            showModal,
            // locations
            locations,
            request,
            currentLocation,
            circleOptions,
            pins,
            mapStyle,
            clusterStyle,
            callback,
        }
    }





    /*
    1
        data: function () {
            return {
            }
        },
        mounted() {
        },
    */
}
</script>

<style>
.GMap__Wrapper {
    width: 100% !important;
    height: 100% !important;
}
</style>