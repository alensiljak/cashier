<template>
    <q-page padding class="text-colour2">
        <Toolbar title="OPFS" />

        <p>Files in OPFS:</p>

        <q-btn label="Create File" @click="onCreateFileClick" />
        <q-btn label="Refresh" @click="onRefreshClick" />

        <q-list>
            <q-item v-for="(item, index) in contents" :key="index">
                <q-item-section>
                    { item }
                </q-item-section>
            </q-item>
        </q-list>
    </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Toolbar from '../components/CashierToolbar.vue'

const contents = ref(null)

onMounted(async () => {
    // 
    await loadFileList()
})

async function loadFileList() {
    // 
    let root = await navigator.storage.getDirectory();
    // let fileHandle = await root.getFileHandle("file.txt");
    // const entries = await root.getEntries();
    // for await (const [key, value] of root.entries()) {
    //     console.log({ key, value });
    // }

    contents.value = await root.entries()
}

async function onCreateFileClick() {
    // 
    await createFile()
}

async function onRefreshClick() {
    await loadFileList()
}

async function createFile() {
    let root = await navigator.storage.getDirectory();
    const fileHandle = await root.getFileHandle('empty-file.txt', { create: true })

    const writable = await fileHandle.createWritable();
    await writable.write('Hello World!');
    await writable.close();
}
</script>