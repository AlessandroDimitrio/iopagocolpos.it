<template>
  <div>
    <div class="sticky top-0 left-0 z-50 bg-blue-grey-700">
      <p class="p-2 mx-auto text-xs sm:text-sm font-semibold text-center text-white">Ciao! Questo progetto è ancora in via di sviluppo. Puoi sostenerci segnalando errori o idee e <a href="">facendo una donazione per sostanere le spese</a></p>
    </div>
    <header class="flex flex-col items-start justify-between px-5 py-2 md:py-10 bg-white border-b border-gray-200 sm:py-5 sm:flex-row sm:items-center">
      <div class="flex flex-row items-center space-x-10">
        <img class="h-16" src="/pos_logo.svg" alt="" />
        <div class="hidden space-x-5 font-semibold sm:flex">
          <nuxt-link to="/" class="hover:text-blue-grey-500 hover:underline" href="">Mappa</nuxt-link>
          <nuxt-link to="/sostienici" class="hover:text-blue-grey-500 hover:underline" href="">L'obbiettivo</nuxt-link>
          <nuxt-link to="/sostienici" class="hover:text-blue-grey-500 hover:underline" href="">Sostienici</nuxt-link>
        </div>
      </div>
      <div class="sticky top-0 left-0 z-50 flex-row items-center hidden space-x-4 sm:flex">
        <button @click="showModal = !showModal" class="flex flex-row items-center py-3 space-x-3 font-semibold text-white transition duration-200 border-t rounded-md bg-blue-grey-700 border-blue-grey-400 hover:bg-blue-grey-900 px-7 focus:ring-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8"></path>
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
            <path d="M19 16v6"></path>
            <path d="M16 19h6"></path>
          </svg>
          <p>Segnala</p>
        </button>
      </div>
    </header>
  </div>
</template>