<template>
    <transition name="fade" appear>
        <div v-show="firsttime" class="relative p-10 border border-gray-300 rounded-xl">
            <p class="text-3xl font-extrabold tracking-tighter text-blue-grey-800">
                👋 <br />Benvenuto!
            </p>
            <p class="mt-2 text-base text-gray-600">
                IoUsoIlPos.it è il primo portale per <strong>segnalare</strong> attività che <strong>non accettano pagamenti con carta</strong>.
            </p>
            <span class="absolute top-4 right-4 opacity-60 cursor-pointer" @click="firsttime = false">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </span>
        </div>
    </transition>
</template>

<script>
import { ref } from "vue"
export default {
    setup() {
        const firsttime = ref(true);
        return { firsttime }
    },
}
</script>
