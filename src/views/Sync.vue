<template>
    <q-page padding class="bg-colour-1 text-colour-2">
        <p>
            The synchronization is done with an instance of hledger-web.
        </p>
    </q-page>
</template>

<script>
import { SET_TITLE } from "../mutations";

export default {
  created() {
    this.$store.commit(SET_TITLE, "Synchronization");
  },
    
}
</script>
