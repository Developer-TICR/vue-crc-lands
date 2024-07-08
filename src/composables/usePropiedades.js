import { ref, computed } from 'vue'
import { collection, doc, deleteDoc } from 'firebase/firestore'
import { ref as storageRef, deleteObject, listAll } from 'firebase/storage'
import { useFirestore, useCollection, useFirebaseStorage } from 'vuefire'

export default function usePropiedades() {
    const piscina = ref(false)
    const storega = useFirebaseStorage()
    const db = useFirestore()
    // get the data from collection
    const propiedadesCollection = useCollection(collection(db, 'propiedades'))

    // borrar propiedad
    async function deleteItem(id, urlImage){
        //console.log(id)
        // referencia del 
        if (confirm('Desea eliminar la propiedad?')) {
            const docRef = doc(db, 'propiedades', id)
            // referencia de la img a eliminar
            const imageRef = storageRef(storega, urlImage)
            // eliminar doc y imagen
            await Promise.all([
                deleteDoc(docRef),
                deleteObject(imageRef)
            ])
            // elminar propiedad
            //await deleteDoc(docRef)
            // emilinar la imagen en storage
            //await deleteObject(imageRef)
        }
    }

    const filteredItems = computed(() => {
        return piscina.value ?
            propiedadesCollection.value.filter( propiedad => propiedad.piscina ) :
            propiedadesCollection.value
    })
  
    return {
        piscina,
        propiedadesCollection,
        filteredItems,
        deleteItem
    }
}