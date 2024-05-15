import { doc, setDoc, getDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js"
import { database } from "./firebase.js"

const rules = {
    "User": {
        id: 'email',
    }
}

async function collectionExists(collection_name) {
    if(rules.hasOwnProperty(collection_name)) return true;
    return false;
}

async function existInCollection(collection_name, id) {
    if(!collectionExists(collection_name)) return null;

    const docPath = doc(database, collection_name + '/' + id);
    const snapShot = await getDoc(docPath);
    return snapShot.exists();
}

export async function create(collection_name, data) {
    if(!collectionExists(collection_name)) return false;

    const collectionRules = rules[collection_name];

    if(!await existInCollection(collection_name, data[collectionRules.id])) {
        const docPath = doc(database, collection_name + '/' + data[collectionRules.id]);
        await setDoc(docPath, data);
        return true;
    }
    return false;
}

export async function read(collection_name, id=null) {
    if(!collectionExists(collection_name)) return null;

    const docPath = doc(database, collection_name + '/' + id);
    const snapShot = await getDoc(docPath);
    if(snapShot.exists()) return snapShot.data();

    return null;
}

export async function update(collection_name, id, data) {
    if(!collectionExists(collection_name)) return false;

    if(await existInCollection(collection_name, id)) {
        const docPath = doc(database, collection_name + '/' + id);
        await setDoc(docPath, data, { merge: true });
        return true;
    }
    return false;
}

export async function remove(collection_name, id) {
    if(!collectionExists(collection_name)) return false;

    if(await existInCollection(collection_name, id)) {
        const docPath = doc(database, collection_name + '/' + id);
        await deleteDoc(docPath);
        return true;
    }
    return false;
}