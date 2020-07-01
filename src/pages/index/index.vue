<template>
  <div>index page</div>
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

<style scoped>

</style>