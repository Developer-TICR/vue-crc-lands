import { computed } from 'vue'
import { ref as storageRef } from 'firebase/storage'
import { useFirebaseStorage, useStorageFile } from 'vuefire'
import { uid } from 'uid'

export default function useImage(){
    // connect service authentication with Storage
    const storage = useFirebaseStorage()
    // Donde vamos a subir la imagen
    const storageRefPath = storageRef(storage, `/propiedades/${uid()}.jpg`)
    // retorna la URL de la imagen
    const {
        url,
        upload
    } = useStorageFile(storageRefPath)
    // 
    function uploadImage(e) {
        // leer archivos que se agrega el usuario JS
        //console.log(e.target.files[0])
        const data = e.target.files[0]
        if (data) {
            upload(data)
        }
        //console.log(url)
    }
    // Computed pora revisar la url de la imagen
    const image = computed(() => {
        return url.value ? url.value : null
    })
    return {
        url,
        uploadImage,
        image
    }
}