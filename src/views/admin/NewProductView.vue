<script setup>
  import { reactive } from 'vue';
  import { useRouter } from 'vue-router';
  import Link from '@/components/Link.vue';
  import useImage from '@/composables/useImage';
  import { useProductsStore } from '@/stores/products';

  const { urls, onFileChange, isImageUploaded } = useImage()
  const products = useProductsStore()
  const router = useRouter()

  const formData = reactive({
    name: '',
    category: '',
    price: '',
    availability: '',
    image: []
  })

  const submitHandler = async data => {
    const { image, ...values } = data;

    try {
      await products.createProduct({
          ...values,
          image: urls.value
        })

        router.push({name: 'products'})
    } catch (e) {
      console.error(e)
    }
  }
</script>

<template>
  <div class="greetings">
    <Link
      :to="{name: 'products'}"
    >
      Volver
    </Link>

    <h1 class="text-4xl font-black my-10">Nuevo producto</h1>

    <div class="flex justify-center bg-white shadow">
      <div class="mt-10 p-10 w-full 2xl:w-2/4">
        <FormKit
          type="form"
          submit-label="Agregar producto"
          incomplete-message="No se pudo enviar, revisa los mensajes"
          @submit="submitHandler"
          :value="formData"
        >
          <FormKit
            type="text"
            label="Nombre"
            name="name"
            placeholder="Nombre del producto"
            validation="required"
            :validation-messages="{ required: 'El nombre del producto es obligatorio'}"
            v-model.trim="formData.name"
          />

          <FormKit
            type="file"
            label="Imagen del producto"
            name="image"
            validation="required"
            :validation-messages="{ required: 'La imagen del producto es obligatoria'}"
            accept=".jpg"
            multiple="true"
            @change="onFileChange"
            v-model.image="formData.image"
          />
          <div v-if="isImageUploaded">
            <p class="font-black">Imagenes:</p>
            <div class="snap-x flex">
              <div 
                class="snap-center flex-auto"
                v-for="url in urls"
                :key="url"
              >
              <img
                :src="url"
                alt="Nueva imagen"
                class="w-32"
              />
              </div>
            </div>
          </div>

          <FormKit
            type="select"
            label="Categoría"
            name="category"
            validation="required"
            :validation-messages="{ required: 'La categoría es obligatoria'}"
            :options="products.categoryOptions"
            v-model.number="formData.category"
          />

          <FormKit
            type="number"
            label="Precio"
            name="price"
            placeholder="Precio del producto"
            validation="required"
            :validation-messages="{ required: 'El precio es obligatorio'}"
            v-model.number="formData.price"
          />

          <FormKit
            type="number"
            label="Disponibles"
            name="availability"
            placeholder="Cantidad disponible"
            validation="required"
            :validation-messages="{ required: 'La cantidad es obligatoria'}"
            v-model.number="formData.availability"
          />

        </FormKit>
      </div>
    </div>

    
  </div>
</template>