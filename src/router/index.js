import { createRouter, createWebHistory } from 'vue-router'
import { onAuthStateChanged } from 'firebase/auth'
import { useFirebaseAuth } from 'vuefire'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/propiedades/:id',
      name: 'propiedad',
      component: () => import('../views/PropiedadView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/admin/AdminLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: 'propiedades',
          name: 'admin-propiedades',
          component: () => import('../views/admin/AdminView.vue')
        },
        {
          path: 'nueva',
          name: 'nueva-propiedad',
          component: () => import('../views/admin/NuevaPropiedadView.vue')
        },
        {
          path: 'editar/:id',
          name: 'editar-propiedad',
          component: () => import('../views/admin/EditarPropiedadView.vue')
        },
      ]
    }
  ]
})

// Guard de navegacion
router.beforeEach(async (to, from, next) => {
  //console.log(to)
  //console.log(from)
  //console.log(next)
  // interseptar el request
  const requiresAuth = to.matched.some(url => url.meta.requiresAuth)
  //console.log(requiresAuth)
  if (requiresAuth) {
    // Comprobar si el usuario esta autenticado
    try {
      // que se detenga hasta que se resuelva la promises
      await authenticateUser()
      next()
    } catch (error) {
      console.log(error)
      next({name: 'login'})
    }
  } else {
    // No esta protegido, mostramos la vista
    next()
  }
})

function authenticateUser() {
  // comprueba si existe una sesion
  const auth = useFirebaseAuth()
  // usa firebase
  return new Promise((resolve, reject) => {
    // pide los datos de la session
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      //console.log(user)
      unsubscribe()
      if (user) {
        resolve(user)
      } else {
        reject()
      }
    })
  })
}

export default router
