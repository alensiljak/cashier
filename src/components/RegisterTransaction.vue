<template>
  <q-item>
    <!-- clickable @click="onItemClicked" -->
    <q-item-section>
      <q-item-label>{{ tx.date }} {{ tx.payee }}</q-item-label>
      <router-link :to="{ name: 'tx', params: { userId: 123 }}">User</router-link>
      <q-item-label caption class="q-ml-xl">
        <div
          v-for="posting in tx.postings"
          :key="posting.id"
        >{{ posting.account }} {{posting.amount}} {{posting.currency}}</div>
      </q-item-label>
    </q-item-section>
    <q-item-section avatar>
      <q-btn
        color="secondary"
        text-color="accent"
        icon="delete"
        round
        size="sm"
        @click="onDeleteClicked"
        :data-id="tx.id"
      />
    </q-item-section>
  </q-item>
</template>

<script>
export default {
    props: ['tx']
}
</script>
