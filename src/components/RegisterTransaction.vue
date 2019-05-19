<template>
  <q-item clickable>
    <!-- clickable @click="onItemClicked" -->
    <q-item-section @click="itemClicked(tx.id)">
      <q-item-label>{{ tx.date }} {{ tx.payee }}</q-item-label>
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
const errorMessage = { color: "secondary", message: "" };
import appService from "../appService";

export default {
  methods: {
    itemClicked(id) {
    //   console.log("item clicked", id);

      // todo make sure delete button is not clicked
      // :to="{ name: 'tx', params: { id: tx.id }}"
      this.$router.push({ name: 'tx', params: { id: id }})
    },
    onDeleteClicked: function(event) {
      let ctl = event.currentTarget;
      let id = ctl.getAttribute("data-id");
      // this.$q.notify(errorMessage)

      var that = this;
      // delete transaction
      appService
        .deleteTransaction(id)
        .then(() => {
          this.$q.notify("Transaction deleted");
          //this.loadData();
          this.$emit('txDeleted')
        })
        .catch(reason => {
          // console.error(reason)
          errorMessage.message = reason.message;
          that.$q.notify(errorMessage);
        });
    }
  },
  props: ["tx"]
};
</script>
