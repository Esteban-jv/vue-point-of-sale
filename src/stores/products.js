import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { useFirestore, useCollection, useFirebaseStorage } from "vuefire";
import { collection, addDoc, where, query, limit, orderBy, updateDoc, doc, getDoc, deleteDoc } from "firebase/firestore";
import { ref as storageRef, deleteObject } from 'firebase/storage'

export const useProductsStore = defineStore('products', () => {

    // normal data
    const categories = [
        { id: 1, name: 'Sudaderas' },
        { id: 2, name: 'Tenis' },
        { id: 3, name: 'Lentes' },
    ]
    const selectedCategory = ref(1)
    // database vars
    const db = useFirestore()
    const storage = useFirebaseStorage()
    const q = query(
        collection(db, 'products'),
        // where('category', '==', 2)
        // limit(10),
        orderBy('availability','asc')
    )
    const productsCollection = useCollection( q )

    async function createProduct(product) {
        await addDoc( collection(db, 'products'), product)
    }
    async function updateProduct(docRef, product) {
        const { image, urls, ...values } = product

        if(image.length) {
            await updateDoc(docRef, {
                ...values,
                image: urls.value
            })
        } else {
            await updateDoc(docRef, values)
        }
    }
    async function deleteProduct(id) {
        if(confirm('¿Eliminar producto?')) {
            const docRef = doc(db, 'products', id)
            const docSnap = await getDoc(docRef)
            const { image } = docSnap.data()
            // const imageRef = storageRef(storage, image)

            // await Promise.all([
                // deleteDoc(docRef),
                // deleteObject(imageRef)
                // Array.from(image).forEach( i => {
                    // const imageRef = storageRef(storage, i)
                    // deleteObject(imageRef)
                // })
            // ])

            const deletePromises = image.map((img) => {
                const imageRef = storageRef(storage, img)
                return deleteObject(imageRef)
            })

            await deleteDoc(docRef)
            await Promise.all(deletePromises)
        }
    }

    // Computed
    const categoryOptions = computed(() => {
        const options = [
            {label: '-- Seleccione --', value:'', attrs: {disabled: true}},
            ...categories.map(cat => (
                {label: cat.name, value: cat.id}
            ))
        ]
        return options
    })
    const noResults = computed(() => productsCollection.value.length === 0 )
    const filteredProducts = computed(() => {
        return productsCollection.value
            .filter(p => p.category == selectedCategory.value)
            .filter(p => p.availability > 0)
    })

    return {
        // Data
        productsCollection,
        categories,
        selectedCategory,
        // Methods
        createProduct,
        updateProduct,
        deleteProduct,
        // Computed
        categoryOptions,
        noResults,
        filteredProducts,
    }
})