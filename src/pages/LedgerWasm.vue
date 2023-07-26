<template>
    <q-page padding class="text-colour2">
        <toolbar title="Ledger-rs" />

        <p>Testing Ledger-rs Wasm usage.</p>
    </q-page>
</template>
<script setup lang="ts">
import { onMounted } from 'vue';
import Toolbar from '../components/CashierToolbar.vue'
import useNotifications from 'src/lib/CashierNotification'
import * as ledger from 'ledger-rs-lib'

const Notification = useNotifications()

onMounted(async () => {
    // console.log(ledger)

    let text = await ledger.wasm_test();
    console.log(text)

    Notification.info(text)
})

</script>