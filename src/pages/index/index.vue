<template>
  <div id="home-page">
    index page
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

<style scoped lang="scss">
  #home-page{
    width: px(375);
    font-size: 12px;
    background-color: grey;
  }
</style>