<template>
    <div class="flex flex-col space-y-5 p-5 border-r bg-gray-50 border-gray-300 w-3/5 overflow-y-scroll h-full pb-96">
        <div class="flex justify-between items-center">
            <input id="mapSearchBox" type="text" placeholder="Cerca locale" class="focus:outline-none border rounded-lg bg-white border-gray-300 shadow-sm px-6 py-3 w-full">
            <button class="h-full font-medium bg-black rounded-lg text-white px-6 py-2 ml-3 font-semibold" @click="$emit('search')">Cerca</button>
        </div>
        <div v-for="(place, i) in places" :key="i" class="flex justify-between hover:bg-gray-50 cursor-pointer rounded-lg p-5 transition-all duration-500 ease-in" :class="selectedClass(place.reference)" @click="$emit('selected', place)">
            <div class="flex flex-col">
                <p class="font-extrabold text-gray-800 mb-2">{{ place.name }}</p>
                <p class="text-gray-600">{{ place.address }}</p>
                <p>Segnalazione di {{ place.lastReport }} fa</p>
            </div>
            <div class="flex flex-col justify-between border border-l-gray-300">
                <div class="flex">
                    <p>{{ place.pos }}</p>
                </div>
                <div class="flex">
                    <p>{{ place.noPos }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: "StoreList",
    props: ['places', 'currentPlace'],
    methods: {
        selectedClass(reference) {
            if (this.currentPlace.hasOwnProperty("reference") && this.currentPlace.reference == reference) return 'shadow-lg bg-white border-0 border-gray-600 border-l-8';
            return "shadow-sm bg-white border border-gray-300"
        }
    }
}
</script>