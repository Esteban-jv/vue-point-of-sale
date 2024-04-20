import { ref, computed } from "vue"
import { useFirebaseStorage } from "vuefire"
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { uid } from "uid"

export default function useImage() {

    // const url = ref(null)
    const urls = ref([])
    const storage = useFirebaseStorage()

    const onFileChange = e => {
        const files = Array.from(e.target.files)
        files.forEach(uploadFile)
    }
    /* // Deprecated
    const onFileChange = e => {
        // const file = e.target.files[0] //convertir a foreach
        // const filename = `${uid()}.jpg`
        console.log(e.target.files)
        const files = e.target.files
        console.warn(files, typeof(files), e.target.files.length, files.length)
        console.warn(files[0])
        Array.from(files).forEach( f => {
            // all this used to be a single one file code
            const filename = `${uid()}.jpg`
            const sRef = storageRef(storage, `/products/${filename}`)
            // Subuir el archivo
            const uploadTask = uploadBytesResumable(sRef, f)
            uploadTask.on('state_changed',
                () => {}, // Mientras se este subiendo
                (e) => console.error(e), // Si ocurre un error
                () => {
                    // Upload is completed
                    getDownloadURL(uploadTask.snapshot.ref)
                        .then( (downloadURL) => {
                            urls.value.push(downloadURL)
                        })
                },
            )
        }) 
    }*/
    const uploadFile = file => {
        const filename = `${uid()}.jpg`
        const sRef = storageRef(storage, `/products/${filename}`)
        const uploadTask = uploadBytesResumable(sRef, file);

        uploadTask.on('state_changed',
            () => {}, // Mientras se este subiendo
            (e) => console.error(e), // Si ocurre un error
            () => {
                // Upload is completed
                getDownloadURL(uploadTask.snapshot.ref)
                    .then( (downloadURL) => {
                        urls.value.push(downloadURL)
                    })
            },
        )
    }

    const isImageUploaded = computed(() => {
        // return url.value ? url.value : null
        return urls.value.length ? urls.value : null
    })

    return {
        // data
        // url,
        urls,
        // methods
        onFileChange,
        // computed
        isImageUploaded
    }
}