<template>
    <div class="relative h-full w-full">
        <Navbar></Navbar>
        <div class="flex flex-col w-full h-full p-5 space-y-5 overflow-y-scroll border-r border-gray-300 bg-gray-50 pb-96">
            <div v-if="!reviews">
                <div id="loading" class="mx-auto mt-20"></div>
            </div>
            <div v-else v-for="(review, i) in reviews" :key="i">
                <div class="flex flex-col">
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
