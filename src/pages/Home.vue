<template>
  <q-page class="flex flex-center bg-colour1">
    <img alt="Quasar logo" src="/icons/icon96.png">

    <q-card dark class="my-card bg-primary q-mb-md">
      <q-card-section>{{ lorem }}</q-card-section>
      <q-separator />
      <q-card-section>{{ lorem }}</q-card-section>
    </q-card>

    <q-card dark bordered class="my-card q-mb-md">
      <q-card-section>{{ lorem }}</q-card-section>
    </q-card>
  </q-page>
</template>

<script>
export default {
  name: 'PageHome',
  data() {
    return {
      lorem: 'some text',
    }
  },
}
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  // max-width: 450px 
</style>