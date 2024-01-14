<template>
  <div id="app" class="main">
    <div class="navbar">
      <nav>
        <router-link class="btn" to="/">Home</router-link>
        <router-link class="btn" to="/about">About</router-link>
      </nav>
    </div>
    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style>
@import "./main.scss";
* {
  margin: 0px;
  padding: 0px;
  box-sizing: border-box;
  font-family: Inter, sens-serif;
  font-weight: 400;
  line-height: 1.75;
}
</style>
