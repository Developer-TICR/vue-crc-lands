<script setup>
    import { useForm, useField } from 'vee-validate';
    import { collection, addDoc } from 'firebase/firestore'
    import { useFirestore } from 'vuefire'
    import { useRouter } from 'vue-router'
    import { validationSchema, imageSchema } from '@/validation/propiedadSchema'
    import useImage from '@/composables/useImage'
    import useLocationMap from '@/composables/useLocationMap'
    import "leaflet/dist/leaflet.css"
    import { LMap, LTileLayer, LMarker } from "@vue-leaflet/vue-leaflet"
     // llenar un select
     const items = [1,2,3,4,5]
     // destructuring 
     const { url, uploadImage, image } = useImage()
     const { zoom, center, pin } = useLocationMap()
     const router = useRouter()
     const db = useFirestore()

    // schema de validacion
     // solo se puede tener una validationSchema, hay que unirlos
    const { handleSubmit } = useForm({
        validationSchema : {
            ...validationSchema,
            ...imageSchema
        }
    })
    // data binding 
    const titulo = useField('titulo')
    const imagen = useField('imagen')
    const precio = useField('precio')
    const habitaciones = useField('habitaciones')
    const wc = useField('wc')
    const estacionamientos = useField('estacionamiento')
    const descripcion = useField('descripcion')
    const piscina = useField('piscina', null, {
        initialValue: false
    })

    // GET the values of event
    const submit = handleSubmit(async ( values ) => {
        //console.log(values)
        // esta linea extrae la imagen del objeto
        const { imagen, ...propiedad } = values
        //console.log(propiedad)
        //return
        const docRef = await addDoc(collection(db, "propiedades"), {
            //name: "Tokyo",
            //country: "Japan"
            // Se usa spread operator para extraer la informacion directa, que no sea otro Obj
            ...propiedad,
            imagen: url.value,
            ubicacion: center.value
        });
        //console.log("Document written with ID: ", docRef.id)
        if (docRef.id) {
            router.push({name: 'admin-propiedades'})
        }
    })
</script>

<template>
    <v-card max-width="800" flat class="mx-auto">
        <v-card-title
            class="text-h4 font-weight-bold"
            tag="h3"
        >
            Nueva Propiedad
        </v-card-title>
        <v-card-subtitle
            class="text-h5 py-5d"
        >
            Agrega una nueva propiedad, complete este formulario.
        </v-card-subtitle>
        <v-form class="mt-10">
            <v-text-field 
                class="mb-5"
                label="Titulo Propiedad"
                v-model="titulo.value.value"
                :error-messages="titulo.errorMessage.value"
            />
            <v-file-input 
                accept="image/jpeg"
                label="Fotografía"
                prepend-icon="mdi-camera"
                class="mb-5"
                v-model="imagen.value.value"
                :error-messages="imagen.errorMessage.value"
                @change="uploadImage"
            />
            <div v-if="image">
                <p class="font-weight-bold">Imagen propiedad:</p>
                <img class="w-50" :src="image" alt="" />
            </div>
            <v-text-field 
                class="mb-5"
                label="Precio"
                v-model="precio.value.value"
                :error-messages="precio.errorMessage.value"
            />
            <v-row>
                <v-col
                    cols="12"
                    md="4"
                >
                    <v-select 
                        label="Habitaciones"
                        class="mb-5"
                        :items="items"
                        v-model="habitaciones.value.value"
                        :error-messages="habitaciones.errorMessage.value"
                    />
                </v-col>
                <v-col
                    cols="12"
                    md="4"
                >
                    <v-select 
                        label="WC"
                        class="mb-5"
                        :items="items"
                        v-model="wc.value.value"
                        :error-messages="wc.errorMessage.value"
                    />
                </v-col>
                <v-col
                    cols="12"
                    md="4"
                >
                    <v-select 
                        label="Estacionamientos"
                        class="mb-5"
                        :items="items"
                        v-model="estacionamientos.value.value"
                        :error-messages="estacionamientos.errorMessage.value"
                    />
                </v-col>
            </v-row>
            <v-textarea 
                class="mb-5" 
                label="Descripción"
                v-model="descripcion.value.value"
                :error-messages="descripcion.errorMessage.value"
            />
            <v-checkbox label="Piscina"/>
            <h2 class="font-weight-bold text-center my-5">Ubicación</h2>
            <div class="pb-10">
                <div style="height:600px">
                    <LMap 
                        ref="map" 
                        v-model:zoom="zoom" 
                        :center="center" 
                        :use-global-leaflet="false">
                        <LMarker 
                            :lat-lng="center"
                            draggable
                            @moveend="pin"
                        />
                    <LTileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        layer-type="base"
                        name="OpenStreetMap"
                    ></LTileLayer>
                    </LMap>
                </div>
            </div>
            <v-btn
                color="pink-accent-3"
                block
                @click="submit"
            >
                Agregar Propiedad
            </v-btn>
        </v-form>
    </v-card>
</template>