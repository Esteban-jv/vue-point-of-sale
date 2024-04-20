import { ref, watch, computed } from "vue";
import { defineStore } from "pinia";
import { useCartStore } from "./cart";

export const useCuponStore = defineStore('cupon', () => {

    // DATA
    const cuponInput = ref('')
    const cuponValidationMessage = ref({
        msg: '',
        type: ''
    })
    const discountPercentage = ref(0)
    const discount = ref(0)
    const cart = useCartStore()
    const VALID_CUPONS = [
        { name: '10DESCUENTO', discount: .10 },
        { name: '20DESCUENTO', discount: .20 },
        { name: 'DEMORAS24', discount: .15 },
    ]

    // COMPUTED
    const isValidCupon = computed(() => discount.value > 0 )

    //METHODS
    function applyCuppon() {
        if(VALID_CUPONS.some(cupon => cupon.name === cuponInput.value)) {
            cuponValidationMessage.value.type = 'success'
            cuponValidationMessage.value.msg = 'Aplicando descuento ...'
            
            setTimeout(() => {
                discountPercentage.value = VALID_CUPONS.find( cupon => cupon.name === cuponInput.value ).discount
                cuponValidationMessage.value.type = 'success'
                cuponValidationMessage.value.msg = 'Descuento aplicado correctamente'
            }, 3000)
        } else {
            cuponValidationMessage.value.type = 'error'
            cuponValidationMessage.value.msg = 'Cupón no encontrado'
        }

        setTimeout(() => {
            cuponValidationMessage.value.type = ''
            cuponValidationMessage.value.msg = ''
        }, 5000)
    }
    function $reset() {
        cuponInput.value = ''
        cuponValidationMessage.value = {
            msg: '',
            type: ''
        }
        discountPercentage.value = 0
        discount.value = 0
    }

    //WATCH
    watch(discountPercentage, () => {
        discount.value = (cart.total * discountPercentage.value).toFixed(2)
    })

    return {
        //DATA
        cuponInput,
        cuponValidationMessage,
        discount,
        //METHODS
        applyCuppon,
        $reset,
        //COMPUTED
        isValidCupon
    }
})