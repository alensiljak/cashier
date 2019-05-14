<template>
  <!-- This is the slide menu component.
  -->
  <div>
    <nav id="menu">
      <header>
        <h2>Menu</h2>
      </header>
    </nav>

    <main id="panel">
      <!-- Here we should insert a component passed from outside -->
      <!-- <component v-bind:is="currentTabComponent"></component> -->
      <!-- https://vuejs.org/v2/guide/components.html#Dynamic-Components -->
      <!-- https://vuejs.org/v2/guide/components-dynamic-async.html -->

      <header>
        <div>
          <button class="toggle-button navbar-toggler">☰</button>
          Panel
        </div>
        <h2>Panel</h2>
      </header>
    </main>
  </div>
</template>
<script>
export default {
  name: "slideout-menu"
};
</script>
