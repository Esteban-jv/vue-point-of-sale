<script setup>
  import { ref } from 'vue';
  import { useCartStore } from '@/stores/cart';
  import { formatCurrency } from '@/helpers';

    const props = defineProps({
        product: {
            type: Object
        }
    })

    const selectedImage = ref(props.product.image[0])
    const cart = useCartStore()

    const changeImage = img => {
      selectedImage.value = img
    }
</script>

<template>
  <div
    class="rounded bg-white shadow relative"
    >
    <div>
      <img
        :src="selectedImage"
        :alt="`Imagen de ${product.name}`"
      />
      <div class="snap-x flex">
        <div 
          class="snap-center flex-auto"
          v-for="img in product.image"
          :key="img"
        >
        <img
          :src="img"
          alt="Nueva imagen"
          class="w-32 cursor-pointer hover:animate-pulse"
          @click="changeImage(img)"
        />
        </div>
      </div>
    </div>
    <div class="p-3 space-y-2">
      <h3 class="text-xl font-black text-gray-500">
        {{ product.name }}
      </h3>
      <p class="text-gray-500">Disponibles: {{ product.availability }}</p>
      <p class="text-2xl font-extrabold text-gray-900">
        {{ formatCurrency(product.price) }}
      </p>
    </div>

    <button
      type="button"
      class="absolute top-5 right-5"
      @click="cart.addItem(product)"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 bg-indigo-600 rounded-full text-white">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>

    </button>
  </div>
</template>