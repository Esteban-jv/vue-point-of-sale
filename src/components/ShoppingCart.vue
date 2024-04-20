<script setup>
  import { formatCurrency } from '@/helpers';
  import { useCartStore } from '@/stores/cart';
  import { useCuponStore } from '@/stores/cupons';
  import ShoppingCartItem from './ShoppingCartItem.vue';
  import Amount from './Amount.vue';
  import CuponForm from './CuponForm.vue';

  const cart = useCartStore()
  const cupon = useCuponStore()
</script>

<template>
  <div class="greetings">
    <p v-if="cart.isEmpty" class="text-xl text-center text-gray-900">Carrito vacío</p>
    <div v-else>
      <p class="text-4xl font-bold text-gray-900">Resumen de venta</p>
      <ul
        role="list"
        class="mt-6 divide-y divide-gray-200"
      >
        <ShoppingCartItem
          v-for="item in cart.items"
          :key="item.id"
          :item="item"
        />

      </ul>

      <dl class="space-y-6 border-t border-gray-200 text-sm font-medium text-gray-500">
        <Amount>
          <template #label>Subtotal:</template>
          {{ formatCurrency(cart.subtotal) }}
        </Amount>
        <Amount>
          <template #label>Impuestos:</template>
          {{ formatCurrency(cart.taxes) }}
        </Amount>
        <Amount v-if="cupon.isValidCupon">
          <template #label>Descuento:</template>
          {{ formatCurrency(cupon.discount) }}
        </Amount>
        <Amount>
          <template #label>Total a pagar:</template>
          {{ formatCurrency(cart.total) }}
        </Amount>
      </dl>

      <CuponForm />

      <button
        class="mt-10 w-full bg-indigo-600 hover:bg-indigo-700 text-white uppercase font-bold p-3"
        @click="cart.checkout"
      >
        Confirmar compra
      </button>
    </div>
  </div>
</template>