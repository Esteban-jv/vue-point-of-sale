import { ref, computed, watchEffect } from "vue";
import { defineStore } from "pinia";
import { query, collection, where, orderBy, getDocs } from "firebase/firestore";
import { useFirestore, useCollection } from "vuefire";

export const useSalesStore = defineStore('sales', () => {

    //DATA
    const date = ref('')
    const db = useFirestore()
    const loading = ref(false)

    //COMPUTED
    const isDateSelected = computed(() => date.value)
    const salesSource = computed(() => {
        if(date.value) {
            // array distructuring
            const [startDate, endDate] = date.value.split('~')
            const q = query(
                collection(db, 'sales'),
                where('date', '>=', startDate.trim()),
                where('date', '<=', endDate.trim()),
                orderBy('date')
            )
            return q
        }
    })
    const noSales = computed(() => !salesCollection.length && date.value )
    const totalSalesOfDay = computed(() => {
        return salesCollection.value ? salesCollection.value.reduce( (total, sale) => total + sale.total, 0) : 0
    })
    const salesCollection = useCollection(salesSource)

    // Watch
    watchEffect(async () => {
        if(salesSource.value) {
            loading.value = true

            try {
                const snapshot = await getDocs(salesSource.value)
                console.warn(snapshot)
            } catch (err) {
                console.error(err)
            } finally {
                loading.value = false
            }
        }
    })

    return {
        //DATA
        date,
        salesCollection,
        loading,
        //METHODS
        //COMPUTED
        isDateSelected,
        noSales,
        totalSalesOfDay,
    }
})