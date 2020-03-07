<template>
  <div id="loading-page" v-if="loading">
    <div class="loading-content">
      <img src="/loading.svg">
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    loading: false
  }),
  methods: {
    start () {
      this.loading = true
    },
    finish () {
      this.loading = false
    }
  }
}
</script>

<style scoped>
#loading-page {
  position: absolute;
  z-index: 2000;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(255, 255, 255, 0.8);
}
#loading-page .loading-content {
  position: absolute;
  left: 50%;
  top: 50%;
  -webkit-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}

.loading-content {
  max-width: 767px;
  width: 100%;
  text-align: center;
}
</style>