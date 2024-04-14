import { collection, doc, getDoc, getDocs, getFirestore, query, where } from "firebase/firestore";

export async function fetchStore(currentUserEmail) {
    const db = getFirestore();

    // Step 1: Query the Users collection to get the user's storeId
    const q = query(collection(db, "Users"), where("email", "==", currentUserEmail));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0].data();
        const storeId = userDoc.storeId;

        // Step 2: Fetch the store details using the storeId
        const storeRef = doc(db, "Store", storeId);
        const storeDoc = await getDoc(storeRef);

        if (storeDoc.exists()) {
            return storeDoc.data();
        } else {
            console.log("No store found.");
        }
    } else {
        console.log("User not found.");
    }

    return null;
}