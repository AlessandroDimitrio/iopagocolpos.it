<template>
    <div class="
                  flex flex-col
                  space-y-5
                  p-5
                  border-r
                  bg-gray-50
                  border-gray-300
                  w-3/5
                  overflow-y-scroll
                  h-full
                  pb-96
                ">
        <div class="flex justify-between items-center">
            <input id="mapSearchBox" type="text" placeholder="Cerca locale" class="
                      focus:outline-none
                      border
                      rounded-lg
                      bg-white
                      border-gray-300
                      shadow-sm
                      px-6
                      py-3
                      w-full
                    " />
            <button class="
                      h-full
                      font-medium
                      bg-white
                      shadow-sm
                      border border-gray-300
                      rounded-lg
                      px-6
                      py-2
                      ml-3
                      font-semibold
                    " @click="$emit('search')">
                    Cerca
                  </button>
        </div>
        <div v-if="isLoading">
            <div id="loading" class="mx-auto mt-20"></div>
        </div>
        <div v-else v-for="(place, i) in places" :key="i" class="
                    flex
                    flex-row
                    items-center
                    justify-between
                    hover:bg-gray-50
                    cursor-pointer
                    rounded-lg
                    p-5
                    transition-all
                    duration-350
                    ease-in
                  " :class="selectedClass(place.reference)" @click="$emit('selected', place)">
            <div class="flex flex-col">
                <div class="flex flex-row">
                     <p class="font-extrabold text-gray-800">{{ place.name }}</p>  <svg class="w-6 h-6 ml-1 text-indigo-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
                </div>
                <p class="text-gray-500">{{ place.address }}</p>
                <p>Segnalazione di {{ place.lastReport }} fa</p>
            </div>
                <Doughnut class="w-16" :chart-options="chartOptions" :chart-data="chartData(i)" />
        </div>
    </div>
</template>

<script>
import { Doughnut } from "vue-chartjs";

import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    CategoryScale,
} from "chart.js";

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

export default {
    name: "StoreList",
    props: ["places", "currentPlace", "isLoading"],
    components: { Doughnut },
    data() {
        return {

            chartOptions: {
                events: [],
                animation: false,
                plugins: {
                    legend: {
                        display: false,
                    },
                },
                tooltips: {
                    enabled: false
                },
                responsive: true,
            },
        };
    },
    methods: {
        chartData(i) {
            return {
                labels: ["Pos", "NoPos"],
                datasets: [{
                    backgroundColor: ["#41B883", "#E46651"],
                    data: [this.places[i].pos, this.places[i].noPos],
                }, ],
            };
        },
        selectedClass(reference) {
            if (
                this.currentPlace.hasOwnProperty("reference") &&
                this.currentPlace.reference == reference
            )
                return "bg-white border-indigo-600 border ring ring-indigo-10 ringo-opacity-50";
            return "shadow-sm bg-white border border-gray-300";
        },
    },
};
</script>