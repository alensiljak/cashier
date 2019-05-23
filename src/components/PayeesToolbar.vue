<template>
  <q-header elevated class="glossy">
    <q-toolbar class="text-colour2">
      <q-btn flat dense round @click="$emit('menuClicked')" aria-label="Menu" icon="fas fa-bars"/>

      <q-toolbar-title>{{title}}</q-toolbar-title>

      <q-space/>

      <q-btn flat round dense icon="fas fa-ellipsis-v">
        <q-menu>
          <q-list dark style="min-width: 175px" class="bg-colour1">
            <!-- dense -->
            <!-- <q-item clickable v-close-popup>
              <q-item-section @click="$emit('createClicked')">Create</q-item-section>
            </q-item>-->

            <q-item v-close-popup>
              <q-item-section @click="$emit('deleteAllClicked')">Delete All</q-item-section>
              <q-item-section side>
                <q-icon name="fas fa-trash-alt"/>
              </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </q-toolbar>
    <!-- filter toolbar -->
    <q-toolbar class="text-white flex flex-center">
      <!-- <q-toolbar-title> -->
      <q-input rounded standout dense dark color="amber-4" style="width: 23rem;" 
        v-model="myFilter" debounce="500">
        <template v-slot:append>
          <q-icon v-if="myFilter === ''" name="fas fa-search"/>
          <q-icon v-else name="clear" class="cursor-pointer" @click="myFilter = ''"/>
        </template>
      </q-input>
    </q-toolbar>
  </q-header>
</template>

<script>
export default {
  data() {
    return {
      //   filter: ""
    };
  },

  props: ["title", "filter"],

  computed: {
    myFilter: {
      get() {
        return this.filter;
      },
      set(value) {
        this.$emit("filter", value);
      }
    }
  }
};
</script>
