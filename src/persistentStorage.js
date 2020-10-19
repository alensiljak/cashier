/**
 * Request persistent storage for IndexedDB
 */

async function persist() {
    return await navigator.storage && navigator.storage.persist &&
        navigator.storage.persist();
}

async function isStoragePersisted() {
    return await navigator.storage && navigator.storage.persisted &&
        navigator.storage.persisted();
}

isStoragePersisted()
.then(async isPersisted => {
    if (isPersisted) {
        console.log(":) Storage is successfully persisted.");
    } else {
        console.log(":( Storage is not persisted.");
        console.log("Trying to persist..:");
        if (await persist()) {
            console.log(":) We successfully turned the storage to be persisted.");
        } else {
            console.log(":( Failed to make storage persisted");
        }
    }
})