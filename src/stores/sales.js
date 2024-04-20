import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { Query, collection, where } from "firebase/firestore";
import { useFirestore, useCollection } from "vuefire";
import { query } from "firebase/database";

export const useSalesStore = defineStore('sales', () => {

    //DATA
    const date = ref('')
    const db = useFirestore()

    //COMPUTED
    const isDateSelected = computed(() => date.value)
    const salesSource = computed(() => {
        if(date.value) {
            console.warn(date.value)
            const q = query(
                collection(db, 'sales'),
                where('date', '==', date.value)
            )
            return q
        }
    })
    const noSales = computed(() => !salesCollection.length && date.value )
    const totalSalesOfDay = computed(() => {
        return salesCollection.value ? salesCollection.value.reduce( (total, sale) => total + sale.total, 0) : 0
    })
    const salesCollection = useCollection(salesSource)

    return {
        //DATA
        date,
        salesCollection,
        //METHODS
        //COMPUTED
        isDateSelected,
        noSales,
        totalSalesOfDay,
    }
})