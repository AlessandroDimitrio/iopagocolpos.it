<template>
  <div
       class="flex flex-col w-full h-full p-5 space-y-5 overflow-y-scroll border-r border-gray-300 sm:w-3/5 bg-gray-50 pb-96">
    <WelcomeMessage></WelcomeMessage>
    <div class="flex items-center justify-between">
      <div
           class="flex items-center flex-grow px-6 py-3 space-x-2 bg-white border border-gray-300 rounded-lg shadow-sm ">
        <svg
             xmlns="http://www.w3.org/2000/svg"
             class="h-6 text-gray-500"
             viewBox="0 0 24 24"
             fill="none"
             stroke="currentColor"
             stroke-width="2"
             stroke-linecap="round"
             stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
               id="mapSearchBox"
               type="text"
               placeholder="Cerca locale"
               class="w-full focus:outline-none" />
      </div>

      <button
              class="h-full px-6 py-2 ml-3 font-semibold bg-white border border-gray-300 rounded-lg shadow-sm "
              @click="$emit('search')">
        Cerca
      </button>
    </div>
    <div v-if="isLoading">
      <div id="loading" class="mx-auto mt-20"></div>
    </div>
    <NuxtLink
              :to="'/attività/' + place.google_id"
              v-else
              v-for="(place, i) in places"
              :key="i"
              class="flex flex-col items-center justify-between p-5 transition-all ease-in rounded-md cursor-pointer sm:flex-row hover:bg-gray-50 duration-350"
              :class="selectedClass(place.google_id)"
              @click="$emit('selected', place)">
      <div class="flex flex-col items-center space-x-2 sm:flex-row">
        <img
             class="w-full rounded-lg sm:h-24"
             :src="place.photo || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2940&q=80'"
             alt="" />
        <div class="flex flex-col mt-5 sm:mt-0">
          <p class="text-lg font-bold text-gray-800">{{ place.name }}</p>
          <p class="text-gray-500">{{ place.address }}</p>
          <p>
            Ultima segnalazione di
            <b>{{ lastReview(place.last_review_timestamp) }}</b>
          </p>
          <!-- <p>a <b>{{ place.distance }} km</b></p> -->
        </div>
      </div>
      <div class="p-4 font-semibold text-red-700 bg-red-50 rounded-xl">
        <span><b>{{ place.reviews_count || "0" }}</b>
          <!-- {{ (place.reviews_count == 1) ? "segnalazione" : "segnalazioni" }} --></span>
      </div>
    </NuxtLink>
  </div>
</template>

<script>
export default {
  name: "StoreList",
  props: {
    places: { default: () => [] },
    currentPlace: { default: null },
    isLoading: { default: false },
  },
  methods: {
    lastReview(ts) {
      // a and b are javascript Date objects
      function dateDiffInMilliseconds(a, b) {
        // Discard the time and time-zone information.
        const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
        const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
        return Math.floor(utc2 - utc1);
      }

      const a = new Date(ts),
        b = new Date();
      let difference = dateDiffInMilliseconds(a, b);

      const _MS_PER_MINUTE = 1000 * 60;
      const _MS_PER_HOUR = _MS_PER_MINUTE * 60;
      const _MS_PER_DAY = _MS_PER_HOUR * 24;

      const d = difference / _MS_PER_DAY;
      difference -= d * _MS_PER_DAY;
      const h = difference / _MS_PER_HOUR;
      difference -= d * _MS_PER_HOUR;
      const m = difference / _MS_PER_MINUTE + 1;

      if (d == 1) return `1 giorno fa`;
      else if (d > 0) return `${d} giorni fa`;
      else if (h == 1) return `1 ora fa`;
      else if (h > 0) return `${h} ore fa`;
      else return `${m} minuti fa`;
    },
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
        this.currentPlace.hasOwnProperty("google_id") &&
        this.currentPlace.google_id == reference
      )
        return "bg-white border-blue-700 border ring ring-blue-700 ring-opacity-40";
      return "shadow-sm bg-white border border-gray-300";
    },
  },
};
</script>