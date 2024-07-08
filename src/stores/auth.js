import { ref, computed, onMounted } from 'vue'
import { defineStore } from 'pinia'
import { useFirebaseAuth } from 'vuefire'
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {

    const auth = useFirebaseAuth()
    const authUser = ref(null)
    const router = useRouter()
    //console.log(authUser.value)
    const errorMsg = ref('')
    const errorCodes = {
        'auth/invalid-credential' : 'Usuario no encontrado'
    }

    // onAuthStateChanged Firebase function, get the old session data
    onMounted(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                //console.log(user)
                authUser.value = user
            }
        })
    })

    // function - destructuring to get email and password
    const login = ({email, password}) => {
        // promises
        signInWithEmailAndPassword(auth, email, password)
            // devuelve las credenciales
            .then( (userCredential) => {
                //console.log(userCredential)
                // add to state
                const user = userCredential.user
                authUser.value = user
                // redirect to admin-propiedades page
                router.push({name: 'admin-propiedades'})
                //console.log(authUser.value)
            })
            .catch( error => {
                //console.log(error.code)
                //console.log(error.message)
                //console.log( errorCodes[ error.code ])
                errorMsg.value = errorCodes[ error.code ]
            })
    }
    // Computed
    // close session
    const logout = () => {
        //console.log('Cerrando sesion...')
        signOut(auth).then(() => {
            authUser.value = null
            // redirect to login page
            router.push({name: 'login'})
        }).catch( error => {
            console.log(error)
        })
    }

    const hasError = computed( () => {
        return errorMsg.value
    } )
    // User logged in
    const isAuth = computed(() => {
        return authUser.value
    })


    return {
        // calling function
        login,
        logout,
        hasError,
        errorMsg,
        isAuth
    }
})