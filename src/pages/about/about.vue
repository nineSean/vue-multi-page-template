<template>
  <div>
    <div>about page</div>
    <p>{{msg}}</p>
  </div>
</template>

<script>
  export default {
    name: "about.vue",
    data() {
      return {
        msg: 'sean',
      }
    },
    created() {
      this.$request.get('/customers', {
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