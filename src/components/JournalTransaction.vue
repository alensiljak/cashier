<template>
  <q-item clickable class="text-amber-2">
    <!-- clickable @click="onItemClicked" -->
    <q-item-section @click="itemClicked(tx.id)">
      <q-item-label>{{ tx.date }} {{ tx.payee }}</q-item-label>
      <q-item-label v-if="tx.note" caption class="q-ml-xl text-amber-2">{{ tx.note }}</q-item-label>
      <q-item-label caption class="q-ml-xl text-amber-2">
        <div v-for="posting in tx.postings" :key="posting.id" class="row">
          <div class="col">{{ posting.account }}</div>
          <div v-if="posting.amount">{{ posting.amount }} {{ posting.currency }}</div>
        </div>
      </q-item-label>
    </q-item-section>
    <q-item-section avatar>
      <q-btn
        color="secondary"
        text-color="accent"
        icon="delete"
        round
        size="sm"
        :data-id="tx.id"
        @click="onDeleteClicked"
      />
    </q-item-section>
  </q-item>
</template>

<script>
export default {
  props: {
    tx: { type: Object, default: null }
  },
  data() {
    return {
      confirmDelete: false
    };
  },

  created() {
    // console.log('reg tx:', this.tx)
  },

  methods: {
    itemClicked(id) {
      this.$router.push({ name: "edittx", params: { id: id } });
    },
    onDeleteClicked: function(event) {
      let ctl = event.currentTarget;
      let id = ctl.getAttribute("data-id");
      // this.$q.notify(errorMessage)

      // request transaction deletion
      this.$emit("tx-delete-clicked", { id: id });
    }
  }
};
</script>
