<template>
  <q-item clickable class="text-amber-2">
    <!-- clickable @click="onItemClicked" -->
    <q-item-section @click="itemClicked(tx.id)">
      <q-item-label>{{ tx.date }} {{ tx.payee }}</q-item-label>
      <q-item-label caption class="q-ml-xl text-amber-2" v-if="tx.comment">{{tx.comment}}</q-item-label>
      <q-item-label caption class="q-ml-xl text-amber-2">
        <div class="row" v-for="posting in tx.postings" :key="posting.id">
          <div class="col">{{ posting.account }}</div>
          <div v-if="posting.amount">{{posting.amount}} {{posting.currency}}</div>
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
        @click="onDeleteClicked"
        :data-id="tx.id"
      />
    </q-item-section>
  </q-item>
</template>

<script>
export default {
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
      //   console.log("item clicked", id);

      // todo make sure delete button is not clicked
      // :to="{ name: 'tx', params: { id: tx.id }}"
      this.$router.push({ name: "tx", params: { id: id } });
    },
    onDeleteClicked: function(event) {
      let ctl = event.currentTarget;
      let id = ctl.getAttribute("data-id");
      // this.$q.notify(errorMessage)

      // request transaction deletion
      this.$emit("txDeleteClicked", { id: id });
    }
  },
  props: ["tx"]
};
</script>
