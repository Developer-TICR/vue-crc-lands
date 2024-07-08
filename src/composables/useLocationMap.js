import { ref } from 'vue'

export default function useLocationMap() {
    const zoom = ref (15)
    // define ubicacion del map
    const center = ref([10.2228473, -85.4335558])
    // Control de donde se suelta el PIN
    function pin(e) {
        //console.log(e.target)
        //console.log(e.target._latlng)
        //console.log(e.target.getLatLng())
        const marker = e.target.getLatLng()
        center.value = [marker.lat, marker.lng]
        //console.log(center.value)
    }

    return {
        zoom,
        center,
        pin
    }
}
