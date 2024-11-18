import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { createDocumentIfNotExists } from "./firebaseDatabase.js";

const auth = getAuth();
const provider = new GoogleAuthProvider();

const googleAuthButton = document.getElementById("googleAuthButton");
const imgGoogle = document.getElementById("img-google");
const spanGoogle = document.getElementById("span-google");

let currentUserUid = null;

// Sign-in function
const userSignIn = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        currentUserUid = user.uid;

        createDocumentIfNotExists("favoritos", { itens: [] }, currentUserUid);
        console.log("Usuário logado:", user);
    } catch (error) {
        console.error("Erro ao logar:", error.message);
    }
};

// Sign-out function
const userSignOut = async () => {
    try {
        await signOut(auth);
        alert("Você foi desconectado com sucesso!");
        currentUserUid = null;
    } catch (error) {
        console.error("Erro ao deslogar:", error.message);
    }
};

const updateUI = (user) => {
    if (user) {
        imgGoogle.src = user.photoURL || "./img/google.png";
        spanGoogle.textContent = `Sair (${user.displayName || "Usuário"})`;
        googleAuthButton.onclick = userSignOut;
        main(categoryFilter = '', subcategoryFilter = '', searchQuery = '', bossFilter = '', worldbossFilter = '', ["nae-e", "sa-f"], false)

    } else {
        imgGoogle.src = "./img/google.png";
        spanGoogle.textContent = "Login com Google";
        googleAuthButton.onclick = userSignIn;
        main(categoryFilter = '', subcategoryFilter = '', searchQuery = '', bossFilter = '', worldbossFilter = '', ["nae-e", "sa-f"], false)

    }
};

onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUserUid = user.uid;
        console.log("Usuário autenticado:", user);
        createDocumentIfNotExists("favoritos", { itens: [] }, currentUserUid);
    } else {
        currentUserUid = null;
    }
    updateUI(user);
});

export async function getCurrentUserUid() {
    return currentUserUid;
}
