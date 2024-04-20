<script setup>
  import { useCuponStore } from '@/stores/cupons';

  const store = useCuponStore()
</script>

<template>
  <h1 class="mt--5 py-5 font-bold border-t border-gray-200">¿Tienes un cupón?</h1>
  <div class="flex">
    <input
      type="text"
      placeholder="Ingresa un cupón"
      class="p-2 bg-white border-gray-300 w-full"
      v-model="store.cuponInput"
    />
    <button
      class="p-3 bg-green-400 font-bold disabled:opacity-50"
      @click="store.applyCuppon"
      :disabled="store.isValidCupon"
    >Canjear</button>
  </div>

  <p
    class="py-2 text-center text-sm font-extrabold"
    :class="{
      'text-green-400' : store.cuponValidationMessage.type === 'success',
      'text-red-400' : store.cuponValidationMessage.type === 'error',
      }">
    {{ store.cuponValidationMessage.msg }}
  </p>
</template>