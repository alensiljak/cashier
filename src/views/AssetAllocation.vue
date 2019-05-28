<template>
    <q-page padding class="bg-colour1 text-colour2">
        Asset Allocation
    </q-page>
</template>

<script>
import { MAIN_TOOLBAR, SET_TITLE } from "../mutations";

export default {
    created() {
        // todo check if there is a definition saved
        // if not, redirect to the setup
        //this.$router.push({ name: 'assetallocationsetup' })

        this.$store.commit(MAIN_TOOLBAR, true);
        this.$store.commit(SET_TITLE, "Asset Allocation");
    }
}
</script>
