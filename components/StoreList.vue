<template>
  <div
    class="
      flex flex-col
      space-y-5
      p-5
      border-r
      bg-blue-grey-050
      border-blue-grey-200
      w-3/5
      overflow-y-scroll
      h-full
      pb-96
    "
  >
    <div class="bg-blue-grey-100 p-10 rounded-md">
            <p class="font-extrabold tracking-tighter text-3xl text-teal-700">
      👋 Benvenuto!
    </p>
    <p class="text-sm text-blue-grey-600 mt-2">
      IoUsoIlPos.it è il primo portale per <strong>segnalare</strong> attività che <strong>non accettano
      pagamenti con carta</strong>.
    </p>
    </div>
    <div class="flex justify-between items-center">
      <input
        id="mapSearchBox"
        type="text"
        placeholder="Cerca locale"
        class="
          focus:outline-none
          border
          rounded-lg
          bg-white
          border-blue-grey-200
          shadow-sm
          px-6
          py-3
          w-full
        "
      />
      <button
        class="
          h-full
          font-medium
          bg-white
          shadow-sm
          border border-blue-grey-200
          rounded-lg
          px-6
          py-2
          ml-3
          font-semibold
        "
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
      class="
        flex flex-row
        items-center
        justify-between
        hover:bg-blue-grey-50
        cursor-pointer
        rounded-md
        p-5
        transition-all
        duration-350
        ease-in
      "
      :class="selectedClass(place.reference)"
      @click="$emit('selected', place)"
    >
      <div class="flex flex-col">
        <div class="flex flex-row">
          <p class="font-bold text-blue-grey-800">{{ place.name }}</p>
        </div>
        <p class="text-blue-grey-500">{{ place.address }}</p>
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
        return "bg-white border-indigo-600 border ring ring-teal-500 ring-opacity-50";
      return "shadow-sm bg-white border border-blue-grey-200";
    },
  },
};
</script>