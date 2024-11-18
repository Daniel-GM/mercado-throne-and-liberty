import { addItemFromArray, removeItemFromArray, getDocumentData } from "./firebaseDatabase.js";
import { getCurrentUserUid } from "./firebaseAuth.js";


window.addItemFromArray = addItemFromArray
window.removeItemFromArray = removeItemFromArray
window.getDocumentData = getDocumentData

window.getCurrentUserUid = getCurrentUserUid