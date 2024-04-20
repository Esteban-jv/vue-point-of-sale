import { ref, computed, watchEffect } from "vue";
import { defineStore } from "pinia";
import { collection, addDoc, runTransaction, doc } from "firebase/firestore";
import { useFirestore } from "vuefire";
import { useCuponStore } from "./cupons";
import { getCurrentDate } from "@/helpers";

export const useCartStore = defineStore('cart', () => {

    // DATA
    const items = ref([])
    const subtotal = ref(0)
    const taxes = ref(0)
    const total = ref(0)
    const cupon = useCuponStore()
    //db stuff
    const db = useFirestore()
    const TAX_RATE = .10

    // METHODS
    function addItem(item) {
        const index = isItemInCart(item.id)
        if(index > -1) {
            //update quantity product
            if(isProductAvailable(item, index)) return //TODO add some error
            items.value[index].quantity++
        } else {
            items.value.push({...item, quantity: 1, id: item.id})
        }
    }
    // Deprecated
    function updateQuantity(id, quantity) {
        items.value = items.value.map( item => item.id === id ? {...item, quantity} : item )
    }
    function addQuantity(id) {
        items.value = items.value.map( item => item.id === id ? {...item, quantity: item.quantity+1 } : item )
    }
    function remQuantity(id) {
        items.value = items.value.map( item => item.id === id ? {...item, quantity: item.quantity-1 } : item )
    }
    function removeItem(id) {
        items.value = items.value.filter( item => item.id !== id)
    }
    const isItemInCart = id => items.value.findIndex(item => item.id === id)
    const isProductAvailable = (item, index) => items.value[index].quantity >= item.availability || items.value[index].quantity >= 5
    // carrito
    async function checkout() {
        try {
            await addDoc(collection(db, 'sales'), {
                items: items.value.map(item => {
                    const { availability, category, ...data } = item
                    return data
                }),
                subtotal: subtotal.value,
                taxes: taxes.value,
                discount: cupon.discount,
                total: total.value,
                date: getCurrentDate(),
            })

            // Sustraer la cantidad de lo disponible
            items.value.forEach( async item => {
                const productRef = doc(db, 'products', item.id)
                await runTransaction(db, async (transaction) => {
                    const currentProduct = await transaction.get(productRef)
                    const availability = currentProduct.data().availability - item.quantity
                    // update product
                    transaction.update(productRef, { availability })
                })
            })

            // Reiniciar el state
            $reset()
            cupon.$reset()
        } catch (err) {
            console.error(err)
        }
    }
    function $reset() {
        items.value = []
        subtotal.value = 0
        taxes.value = 0
        total.value = 0
    }

    // COMPUTED
    const isEmpty = computed(() => items.value.length === 0 )
    const checkProductAvailability = computed(() => {
        return product => product.availability < 5 ? product.availability : 5
    })

    // WATCH
    /* deprecated */
    /*
    watch(items, () => {
        subtotal.value = items.value.reduce((total, item) => total + (item.quantity * item.price), 0 )
        taxes.value = subtotal.value * TAX_RATE,
        total.value = taxes.value + subtotal.value
    }, {
        deep: true
    })*/
    watchEffect(() => {
        subtotal.value = items.value.reduce((total, item) => total + (item.quantity * item.price), 0 )
        taxes.value = Number((subtotal.value * TAX_RATE).toFixed(2)),
        total.value = Number((taxes.value + subtotal.value - cupon.discount).toFixed(2))
    })

    return {
        // Data
        items,
        subtotal,
        taxes,
        total,
        // Methods
        addItem,
        // updateQuantity,
        addQuantity,
        remQuantity,
        removeItem,
        checkout,               //carrito
        // Computed
        isEmpty,
        checkProductAvailability
    }
})