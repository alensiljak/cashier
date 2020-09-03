view<template>
  <q-page padding class="bg-colour1 text-colour2">
    <p>
      This will execute Ledger Xact command, creating a matching transaction.
    </p>

    <!-- date -->
    <q-dialog ref="qDateProxy" v-model="datePickerVisible">
      <q-card dark>
        <q-card-section class="q-pa-none">
          <q-date
            ref="datePicker"
            v-model="date"
            dark
            first-day-of-week="1"
            today-btn
            mask="YYYY-MM-DD"
            @input="onDateSelected"
          />
        </q-card-section>
        <q-separator dark />
        <q-card-actions align="right">
          <q-btn v-close-popup label="OK" flat color="secondary" text-color="accent" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-input v-model="date" label="Date From" dark @click="datePickerVisible = true">
      <template v-slot:prepend>
        <font-awesome-icon icon="calendar-day" />
      </template>
    </q-input>

    <q-input v-model="freeText" label="Free-text search" dark @keypress="handleEnter" />

    <!-- action button -->
    <div class="text-center q-my-lg">
      <q-btn color="secondary" text-color="accent" @click="run">
        <font-awesome-icon icon="search" transform="grow-6 right-6" class="q-mr-sm" />
        <span class="q-ml-sm">Xact</span>
      </q-btn>
    </div>
  </q-page>
</template>

<script>
import { MAIN_TOOLBAR, SET_TITLE } from "../mutations";

export default {
  data() {
    return {
        date: null,
        datePickerVisible: false,
        freeText: null
    };
  },

  created() {
    this.$store.commit(SET_TITLE, "Xact");
    this.$store.commit(MAIN_TOOLBAR, true);

    //this.loadSettings();
  },

  methods: {
    handleEnter(e) {
      //
      //console.log(e)
      if (e.keyCode === 13) {
        // handle Enter
        this.search()
      }
    },
    onDateSelected(value, reason) {
      // console.log(value, reason)
      if (reason !== "day" && reason !== "today") return;
      // close the picker if the date was selected
      this.$refs.qDateProxy.hide();
      // the date is saved on close.
    },
    run() {
        // todo: run xact
    }
  }
};
</script>