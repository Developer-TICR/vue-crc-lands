<script setup>
import { RouterLink, RouterView } from 'vue-router'
//import { storeToRefs } from 'pinia'
import { useAuthStore } from './stores/auth'
// calling auth user
const auth = useAuthStore()
// destructurin rompe con la reactividad
// solo se la aplica a la parte reactiva, solo ref, reactive, o un computed property
// en algo que modifica el state
//const { isAuth } = storeToRefs(auth)
</script>

<template>
  <v-card
    elevation="3"
    max-width="1200"
    class="mx-auto"
  >
  <v-layout>
      <v-app-bar
        color="blue-darken-1"
        >
        <template v-slot:prepend>
          <v-btn
            :to="{name:'home'}"
          >
          Costa Rica's Lands
          </v-btn>
        </template>

        <template v-slot:append>
          <div v-if="auth.isAuth">
            <v-btn :to="{name:'admin-propiedades'}">Admin</v-btn>
            <v-btn @click="auth.logout" >Cerrar Sesion</v-btn>
          </div>
          <div v-else>
            <v-btn :to="{name:'home'}">Inicio</v-btn>
            <v-btn :to="{name:'login'}">Iniciar Sesion</v-btn>
          </div>
        </template>
      
      </v-app-bar>
      <v-main>
        <v-container>
          <RouterView />
        </v-container>
      </v-main>
    </v-layout>
  </v-card>
</template>

<style scoped>

</style>
