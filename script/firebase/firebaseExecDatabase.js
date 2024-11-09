import { addItemFromArray, removeItemFromArray, readDocuments } from "./firebaseDatabase.js";
import { getCurrentUserUid } from "./firebaseAuth.js";

const btnFavorite = document.getElementsByClassName("favorite-button")


const userUid = getCurrentUserUid();

async function addItem() {
    await addItemFromArray("favoritos", userUid, item);
}
// "legs_leather_aa_t1_nomal_001_TraitExtract"

// await removeItemFromArray("favoritos", userUid, "legs_leather_aa_t1_nomal_001_TraitExtract", userUid);



btnFavorite.addEventListener('click', console.log("1"))