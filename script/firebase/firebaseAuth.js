import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js"
import { createDocumentIfNotExists } from "./firebaseDatabase.js"

const auth = getAuth()
const provider = new GoogleAuthProvider()

const googleAuthButton = document.getElementById("googleAuthButton")
const imgGoogle = document.getElementById("img-google")
const spanGoogle = document.getElementById("span-google")

let currentUserUid = null

const userSignIn = async () => {
    try {
        const result = await signInWithPopup(auth, provider)
        const user = result.user
        currentUserUid = user.uid

        createDocumentIfNotExists("favoritos", { itens: [] }, currentUserUid)
        console.log("Usuário logado:", user)
    } catch (error) {
        console.error("Erro ao logar:", error.message)
    }
}

const userSignOut = async () => {
    const confirmation = confirm("Tem certeza que deseja sair?");
    if (!confirmation) {
        return;
    }

    try {
        await signOut(auth)
        currentUserUid = null
    } catch (error) {
        console.error("Erro ao deslogar:", error.message)
    }
}

const updateUI = (user) => {
    if (user) {
        imgGoogle.src = user.photoURL || "./img/google.png"
        spanGoogle.textContent = `${user.displayName || "Usuário"}`
        googleAuthButton.onclick = userSignOut

        googleAuthButton.onmouseenter = () => {
            spanGoogle.textContent = "Sair"
        }
        googleAuthButton.onmouseleave = () => {
            spanGoogle.textContent = `${user.displayName || "Usuário"}`
        }

    } else {
        imgGoogle.src = "./img/google.png"
        spanGoogle.textContent = "Login com Google"
        googleAuthButton.onclick = userSignIn

        googleAuthButton.onmouseenter = null
        googleAuthButton.onmouseleave = null

    }
    main(categoryFilter = '', subcategoryFilter = '', searchQuery = '', bossFilter = '', worldbossFilter = '', ["nae-e", "sa-f"], false)
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUserUid = user.uid
        console.log("Usuário autenticado:", user)
        createDocumentIfNotExists("favoritos", { itens: [] }, currentUserUid)
    } else {
        currentUserUid = null
    }
    updateUI(user)
})

export async function getCurrentUserUid() {
    return currentUserUid
}
