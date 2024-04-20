import { generateClasses } from "@formkit/themes"

const config = {
    config: {
        classes: generateClasses({
            global: {
                label: 'block mb-1 font-bold text-lg',
                message: 'text-red-500 mb-5',
                wrapper: 'space-y-2 mb-3',
                input: 'w-full p-3 border border-gray-300 rounded text-gray-700 placeholder-gray-400'
            },
            /*text: { //estos sobreescriben a global
                label: 'block mb-1 font-bold text-lg uppercase',
                message: '$reset text-green-500'
            },
            number: {
                label: '$reset', //$reset elimina absolitamente todas las clases aplicadas en global
                message: 'text-red-500'
            },
            select: {
                label: 'block mb-1 font-bold text-lg',
                message: 'text-red-500'
            },*/
            file: {
                noFile: 'block my-2'
            },
            submit: {
                input: '$reset bg-green-400 hover:bg-green-500 w-full p-2 font-bold uppercase disabled:opacity-50'
            }
        })
    }
}

export default config