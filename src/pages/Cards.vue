<template>
  <q-page padding class="bg-colour1 text-colour2">
    Cards page
    <q-card dark class="my-card bg-primary">
      <q-card-section>{{ lorem }}</q-card-section>
      <q-separator />
      <q-card-section>{{ lorem }}</q-card-section>
    </q-card>
    <q-card dark bordered class="my-card">
      <q-card-section>{{ lorem }}</q-card-section>
    </q-card>
  </q-page>
</template>

<script>
export default {
    data() {
        return {
            lorem: 'some text'
        }
    }
}
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 450px
</style>

