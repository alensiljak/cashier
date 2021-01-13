<template>
  <q-page padding class="bg-colour1 text-colour2">
    <toolbar title="Reorder Postings" />

    <q-list dark separator class="bg-colour1 list">
      <slot />
    </q-list>
  </q-page>
</template>
<script>
import Toolbar from '../components/Toolbar'
import { ContainerMixin } from 'vue-slicksort'
import AccountItem from "../components/SortableAccountItem";

export default {
  components: {
    Toolbar
  },

  data() {
    return {
      postings: []
    }
  },

  methods: {
      loadData() {
          this.postings.push('one')
          this.postings.push('two')
      }
  }
}
</script>