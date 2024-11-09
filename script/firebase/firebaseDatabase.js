import { getFirestore, collection, setDoc, getDoc, doc, updateDoc, arrayUnion, arrayRemove } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { app } from "./firebaseApp.js";

const db = getFirestore(app);

export async function createDocumentIfNotExists(collectionName, data, currentUserUid) {
    if (!currentUserUid) {
        console.error("Usuário não autenticado.");
        return;
    }

    try {
        const docRef = doc(db, collectionName, currentUserUid);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            await setDoc(docRef, data);
            console.log("Documento criado com UID do usuário como ID:", currentUserUid);
        } else {
            console.log("Documento já existe, nenhuma ação necessária.");
        }
    } catch (error) {
        console.error("Erro ao verificar ou adicionar documento:", error);
    }
}

export async function addItemFromArray(collectionName, documentId, newItem) {
    try {
        const docRef = doc(db, collectionName, documentId);
        
        await updateDoc(docRef, {
            itens: arrayUnion(newItem)
        });
        console.log("Item adicionado ao documento:", documentId);
    } catch (error) {
        console.error("Erro ao atualizar documento:", error);
    }
}

export async function removeItemFromArray(collectionName, documentId, itemToRemove) {
    try {
        const docRef = doc(db, collectionName, documentId);
        
        await updateDoc(docRef, {
            itens: arrayRemove(itemToRemove)
        });
        console.log("Item removido do documento:", documentId);
    } catch (error) {
        console.error("Erro ao atualizar documento:", error);
    }
}

export async function getDocumentData(collectionName, documentId) {
    try {
        const docRef = doc(db, collectionName, documentId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            return docSnap.data().itens;
        } else {
            console.log("Documento não encontrado.");
            return null;
        }
    } catch (error) {
        console.error("Erro ao ler o documento:", error);
    }
}

