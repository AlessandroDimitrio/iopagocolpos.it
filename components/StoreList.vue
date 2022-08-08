<template>
  <div
    class="flex flex-col w-3/5 h-full p-5 space-y-5 overflow-y-scroll border-r border-gray-200 bg-gray-50 pb-96"
  >
    <div class="p-10 bg-gray-200 rounded-xl">
            <p class="text-3xl font-extrabold tracking-tighter text-blue-600">
      👋 <br/>Benvenuto!
    </p>
    <p class="mt-2 text-base text-gray-600">
      IoUsoIlPos.it è il primo portale per <strong>segnalare</strong> attività che <strong>non accettano
      pagamenti con carta</strong>.
    </p>
    </div>
    <div class="flex items-center justify-between">
      <input
        id="mapSearchBox"
        type="text"
        placeholder="Cerca locale"
        class="w-full px-6 py-3 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none"
      />
      <button
        class="h-full px-6 py-2 ml-3 font-medium font-semibold bg-white border border-gray-200 rounded-lg shadow-sm"
        @click="$emit('search')"
      >
        Cerca
      </button>
    </div>
    <div v-if="isLoading">
      <div id="loading" class="mx-auto mt-20"></div>
    </div>
    <div
      v-else
      v-for="(place, i) in places"
      :key="i"
      class="flex flex-row items-center justify-between p-5 transition-all ease-in rounded-md cursor-pointer hover:bg-gray-50 duration-350"
      :class="selectedClass(place.reference)"
      @click="$emit('selected', place)"
    >
      <div class="flex flex-col">
        <div class="flex flex-row">
          <p class="font-bold text-gray-800">{{ place.name }}</p>
        </div>
        <p class="text-gray-500">{{ place.address }}</p>
        <p>Segnalazione di {{ place.lastReport }} fa</p>
      </div>
      <Doughnut
        class="w-16"
        :chart-options="chartOptions"
        :chart-data="chartData(i)"
      />
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
          enabled: false,
        },
        responsive: true,
      },
    };
  },
  methods: {
    chartData(i) {
      return {
        labels: ["Pos", "NoPos"],
        datasets: [
          {
            backgroundColor: ["#41B883", "#E46651"],
            data: [this.places[i].pos, this.places[i].noPos],
          },
        ],
      };
    },
    selectedClass(reference) {
      if (
        this.currentPlace.hasOwnProperty("reference") &&
        this.currentPlace.reference == reference
      )
        return "bg-white border-indigo-600 border ring ring-blue-500 ring-opacity-50";
      return "shadow-sm bg-white border border-gray-200";
    },
  },
};
</script>