<template>
    <q-page padding class="text-colour2">
        <toolbar title="Ledger-rs" />

        <p>Testing Ledger-rs Wasm usage.</p>

        <div>
            {{ message }}
        </div>

        <button @click="onCashierWasmClick">Cashier Wasm</button>
    </q-page>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Toolbar from '../components/CashierToolbar.vue'
import useNotifications from 'src/lib/CashierNotification'
// import * as ledger from 'ledger-rs-lib'
// import * as cashierWasm from 'cashier-wasm'

const Notification = useNotifications()

const message = ref('')

onMounted(async () => {
    // console.log(ledger)

    // let text = await ledger.wasm_test();
    // console.log(text)

    // Notification.info(text)

    // message.value = text
})

async function onCashierWasmClick() {
    message.value = 'Wasm has been removed';
    // message.value = await cashierWasm.hi();

    //await cashierWasm.greet('me!')
}
</script>