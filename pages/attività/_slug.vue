<template>
    <div class="relative w-full h-full">
        <Navbar></Navbar>
        <div class="max-w-5xl mx-5 mt-10 sm:mx-auto">
            <nuxt-link to="/" class="flex items-center px-4 py-2 space-x-1 font-semibold text-black border border-gray-200 rounded-md w-max">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                <p class="text-sm">Torna indietro</p>
            </nuxt-link>
            <p class="mt-5 text-4xl font-bold">Antica Pizzeria da Michele</p>
            <p class="font-semibold">Via bla bla bla</p>
            <div class="flex flex-col mt-10 sm:flex-row">
            <div class="sm:w-1/2">
                            <p class="font-semibold">Recensioni (23)</p>
                    <div class="flex flex-col w-full h-full pt-5 space-y-5 overflow-y-scroll pb-96">
            <div v-if="!reviews">
                <div id="loading" class="mx-auto mt-20"></div>
            </div>
            <div v-else v-for="(review, i) in reviews" :key="i">
                <div class="flex flex-col p-5 border border-gray-200 rounded-md">
                    <div class="flex flex-row">
                        <p class="font-bold text-gray-800">{{ review.comment ? review.comment : "No comment" }}</p>
                    </div>
                    <p class="text-gray-500"></p>
                    <p>Segnalazione di <b>{{ review.email }}</b></p>
                    <p>del <b>{{ review.created_at }}</b></p>
                </div>
            </div>
            </div>
            </div>
            <div class="p-5 bg-gray-100 sm:w-1/2">
                <p class="font-semibold">Lascia una recensione</p>
            </div>
        </div>
        </div>
    </div>
</template>

<script>
let server_url = "https://plankton-app-p6yje.ondigitalocean.app";
// server_url = "http://localhost:3002";
export default {
    async asyncData({ app, params }) {
        console.log(params)
        const response = await new Promise((resolve, reject) => {
            app.$axios.$get(`${server_url}/activity/${params.slug}/reviews`).then(r => resolve(r)).catch(e => reject(e))
        })
        return { reviews: response.reviews };
    }
};
</script>
