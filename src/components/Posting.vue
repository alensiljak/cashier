<template>
  <div>
    <div class="row">
      <!-- spacer -->
      <div class="col-1" />

      <div class="col">
        <!-- Account -->
        <q-input
          v-model="posting.account"
          dark
          label="Account"
          @click="$emit('account-clicked')"
        />
      </div>
    </div>

    <div class="row justify-end">
      <div class="col-2" />
      <div class="col-3 col-xs-5">
        <!-- Amount -->
        <q-input
          v-model.number="posting.amount"
          dark
          label="Amount"
          type="number"
          input-class="text-right"
          @change="$emit('amount-changed')"
        />
      </div>

      <div class="q-pl-sm col-3 col-xs-4">
        <!-- currency -->
        <q-input v-model="posting.currency" dark label="Currency" />
      </div>
    </div>
  </div>
</template>

<script>
import appService from '../appService'

export default {
  props: {
    posting: { type: Object, default: null },
    index: { type: Number, default: null },
  },

  data: function () {
    return {
      accountOptions: null,
    };
  },

  created() {
    // console.log(this.accounts)
  },

  methods: {
  },
};
</script>
