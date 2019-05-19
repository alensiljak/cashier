<template>
    <q-page padding class="bg-colour1 text-colour2">
        Commodities
    </q-page>
</template>

<script>
import { SET_TITLE } from '../mutations'

export default {
    created() {
        this.$store.commit(SET_TITLE, "Commodities");
    }
}
</script>

