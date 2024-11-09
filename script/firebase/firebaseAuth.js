import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { createDocumentIfNotExists } from "./firebaseDatabase.js";

const auth = getAuth();
const provider = new GoogleAuthProvider();

const signInButton = document.getElementById("signInButton");
const signOutButton = document.getElementById("signOutButton");

signOutButton.style.display = 'none';

let currentUserUid = null;

const userSignIn = async () => {
    signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            currentUserUid = user.uid;
            console.log(user);

            createDocumentIfNotExists("favoritos", { itens: [] }, currentUserUid);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;

            console.log(errorCode + ": " + errorMessage);
        });
};

const userSignOut = async () => {
    signOut(auth)
        .then(() => {
            alert("Seu usuario foi deslogado com sucesso!");
            currentUserUid = null;
        }).catch((error) => {
            console.log(error);
        });
};

onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log(user);
        currentUserUid = user.uid;
        signInButton.style.display = 'none';
        signOutButton.style.display = 'block';

        createDocumentIfNotExists("favoritos", { itens: [] }, currentUserUid);
    } else {
        currentUserUid = null;
        signInButton.style.display = 'block';
        signOutButton.style.display = 'none';
    }
});

signInButton.addEventListener('click', userSignIn);
signOutButton.addEventListener('click', userSignOut);

export function getCurrentUserUid() {
    return currentUserUid;
}
