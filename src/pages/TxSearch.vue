<template>
  <q-page padding class="bg-colour1 text-colour2">
    <p>Date presets (last week, month, quarter, year)</p>

    <!-- date -->
    <q-dialog ref="qDateProxy" v-model="datePickerVisible">
      <q-date
        ref="datePicker"
        v-model="dateFrom"
        dark
        first-day-of-week="1"
        today-btn
        mask="YYYY-MM-DD"
        @input="onDateSelected"
      />
    </q-dialog>

    <q-input v-model="dateFrom" label="Date From" dark @click="datePickerVisible = true">
      <template v-slot:prepend>
        <font-awesome-icon icon="calendar-day" />
      </template>
    </q-input>

    <q-dialog ref="qDateToProxy" v-model="dateToPickerVisible">
      <q-date
        ref="dateToPicker"
        v-model="dateTo"
        dark
        first-day-of-week="1"
        today-btn
        mask="YYYY-MM-DD"
        @input="onDateToSelected"
      />
    </q-dialog>
    <div class="row">
      <div class="col-9">
        <q-input v-model="dateTo" label="Date To" dark @click="dateToPickerVisible = true">
          <template v-slot:prepend>
            <font-awesome-icon icon="calendar-day" />
          </template>
        </q-input>
      </div>
      <div class="col">
        <q-checkbox v-model="sameDate" label="Same as From" />
      </div>
    </div>

    <!-- payee -->
    <q-input v-model="payee" label="Payee" dark>
      <template v-slot:prepend>
        <font-awesome-icon icon="user" />
      </template>
    </q-input>

    <!-- search button -->
    <div class="text-center q-my-lg">
      <q-btn color="secondary" text-color="accent" @click="search">
        <font-awesome-icon icon="search" transform="grow-6 right-6" class="q-mr-sm" />
        <span class="q-ml-sm">Search</span>
      </q-btn>
    </div>

    <!-- results -->
    <q-input
      v-model="results"
      type="textarea"
      autogrow
      filled
      style="width: 100%; max-height: 90%"
      input-class="text-amber-2"
      color="primary"
    />
  </q-page>
</template>

<script>
import { MAIN_TOOLBAR, SET_TITLE } from "../mutations";

export default {
    data() {
      return {
        datePickerVisible: false,
        dateToPickerVisible: false,
        dateFrom: null,
        dateTo: null,
        sameDate: true,
        payee: null,
        results: null
      }
    },

  created() {
    this.$store.commit(SET_TITLE, "Transaction Search");
    this.$store.commit(MAIN_TOOLBAR, true);

    //this.loadSettings();
  },

  methods: {
    onDateSelected(value, reason) {
      // console.log(value, reason)
      if (reason !== "day" && reason !== "today") return;
      // close the picker if the date was selected
      this.$refs.qDateProxy.hide();
      // the date is saved on close.
    },
    onDateToSelected(value, reason) {
      if (reason !== "day" && reason !== "today") return;
      this.$refs.qDateToProxy.hide();
    },
    search() {
        // run the search
        //const message = "Not implemented yet"
        //this.$q.notify({ message: message, color: "primary" }) // green
        //this.$q.notify({ message: message, color: "secondary" }) // red
    }
  }
}
</script>

<style>

</style>
