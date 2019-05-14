<template>
<div>
      <nav id="menu">
    <header>
      <h2>Menu</h2>
    </header>
  </nav>

  <main id="panel">
    <header>
      <h2>Panel</h2>
    </header>
  </main>
</div>
</template>
<script>
export default {
    name: 'slideout-menu'
    
}
</script>
<style>
.slideout-menu {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 256px;
  min-height: 100vh;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  z-index: 0;
  display: none;
}

.slideout-menu-left {
  left: 0;
}

.slideout-menu-right {
  right: 0;
}

.slideout-panel {
  position: relative;
  z-index: 1;
  will-change: transform;
  background-color: #fff; /* A background-color is required */
  min-height: 100vh;
}

.slideout-open,
.slideout-open body,
.slideout-open .slideout-panel {
  overflow: hidden;
}

.slideout-open .slideout-menu {
  display: block;
}
</style>
