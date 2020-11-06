<template>
  <q-header elevated class="glossy">
    <q-toolbar class="text-colour2">
      <q-btn flat dense round aria-label="Menu" icon="menu" @click="$emit('menu-clicked')" />

      <q-toolbar-title>{{ title }}</q-toolbar-title>

      <q-space />

      <q-btn flat round dense icon="more_vert">
        <q-menu>
          <q-list dark style="min-width: 175px" class="bg-colour1">
            <!-- dense -->

            <q-item v-close-popup>
              <q-item-section @click="$emit('delete-all-clicked')">Delete All</q-item-section>
              <q-item-section side>
                <font-awesome-icon icon="trash-alt" transform="grow-9 left-5" />
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section @click="goToCache">Cache</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </q-toolbar>

    <!-- filter toolbar -->
    <q-toolbar class="text-white flex flex-center">
      <!-- <q-toolbar-title> -->
      <q-input
        v-model="myFilter"
        autofocus
        rounded
        standout
        dense
        dark
        color="accent"
        style="width: 23rem;"
        debounce="500"
      >
        <template #append>
          <font-awesome-icon v-if="myFilter === ''" icon="search" />
          <q-icon v-else name="clear" class="cursor-pointer" @click="myFilter = ''" />
        </template>
      </q-input>
    </q-toolbar>
  </q-header>
</template>

<script>
export default {

  props: {
    title: { type: String, default: "" },
    filter: { type: String, default: "" }
  },
  data() {
    return {
      //   filter: ""
    };
  },

  computed: {
    myFilter: {
      get() {
        return this.filter;
      },
      set(value) {
        this.$emit("filter", value);
      }
    }
  },

  methods: {
    goToCache() {
      this.$router.push({ name: "cache" });
    }
  }
};
</script>
