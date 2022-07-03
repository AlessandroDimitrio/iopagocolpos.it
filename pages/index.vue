<template>
    <div class="antialiased">
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
                <p class="text-2xl font-extrabold mont">Iopagocolpos.it</p>
                <p class="text-sm text-gray-500">Il portale per segnalare attività che non accettano pagamenti con carta</p>
            </div>
            <button class="mt-2 sm:mt-0 font-medium bg-black rounded-lg text-white px-6 py-2" @click="showModal = true">Contribuisci</button>
        </div>
        <div class="flex flex-row">
            <div class="flex flex-col space-y-5 p-5 border-r bg-gray-50 border-gray-300 w-96 overflow-y-scroll h-full">
                <input type="text" placeholder="Cerca locale" class="focus:outline-none border rounded-lg bg-white border-gray-300 shadow-sm px-6 py-3">
                <div class="bg-white shadow-sm hover:bg-gray-100 border rounded-lg p-5 border-gray-300">
                    <p class="font-extrabold text-gray-800 mb-2">Ristorante La Pergola</p>
                    <p class="text-gray-600">Via dei Savoiardi 12</p>
                    <p>Segnalazione di 12 giorni fa</p>
                </div>
                <div class="bg-white shadow-sm hover:bg-gray-100 border rounded-lg p-5 border-gray-300">
                    <p class="font-extrabold text-gray-800 mb-2">Ristorante La Pergola</p>
                    <p class="text-gray-600">Via dei Savoiardi 12</p>
                    <p>Segnalazione di 12 giorni fa</p>
                </div>
                <div class="bg-white shadow-sm hover:bg-gray-100 border rounded-lg p-5 border-gray-300">
                    <p class="font-extrabold text-gray-800 mb-2 mont">Ristorante La Pergola</p>
                    <p class="text-gray-600">Via dei Savoiardi 12</p>
                    <p>Segnalazione di 12 giorni fa</p>
                </div>
                <div class="bg-white shadow-sm hover:bg-gray-100 border rounded-lg p-5 border-gray-300">
                    <p class="font-extrabold text-gray-800 mb-2">Ristorante La Pergola</p>
                    <p class="text-gray-600">Via dei Savoiardi 12</p>
                    <p>Segnalazione di 12 giorni fa</p>
                </div>
                <div class="bg-white shadow-sm hover:bg-gray-100 border rounded-lg p-5 border-gray-300">
                    <p class="font-extrabold text-gray-800 mb-2">Ristorante La Pergola</p>
                    <p class="text-gray-600">Via dei Savoiardi 12</p>
                    <p>Segnalazione di 12 giorni fa</p>
                </div>
    
            </div>
            <div class="bg-red-600 w-auto">
    
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'IndexPage',
    data: function() {
        return {
            showModal: false
        }
    }

}
</script>
