<template>
  <div :class="$style.homePage">
    index page
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: "index.vue",
    data() {
      return {
        list: [],
      }
    },
    created() {
      this.$request.get('/users', {
        params: {
          // x: 'x'
        },
      }).then(data => {
        console.log('index page data', data)
      })
    }
  }
</script>

<style module lang="scss">
  .home-page{
    width: px(375);
    font-size: 12px;
  }
</style>