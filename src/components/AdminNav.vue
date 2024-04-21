<script setup>
    import Link from './Link.vue';
    import Logo from './Logo.vue';
</script>

<template>
  <header class="px-10 py-5 bg-gray-700 flex justify-between absolute top0 w-full z-index">
    <div>
        <Logo />
    </div>
    <nav>
        <div class="flex justify-between">
            <div>
                <RouterLink 
                    :to="{name: 'products'}"
                    class="rounded text-white font-bold p-2"
                >
                    Productos
                </RouterLink>
                <RouterLink 
                    :to="{name: 'sales'}"
                    class="rounded text-white font-bold p-2"
                >
                    Ventas
                </RouterLink>
            </div>
            <div>
                <Link
                    :to="{name: 'shop'}"
                    >
                        Tienda
                    </Link>
            </div>
        </div>
    </nav>
  </header>
</template>