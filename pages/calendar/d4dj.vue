<template>
  <div>
    <client-only>
      <all-calendar project="d4dj"></all-calendar>
    </client-only>
  </div>
</template>
<script>
  export default {
    head () {
      return {
        title: 'D4DJ 이벤트 캘린더',
        meta: [
          { name: 'og:title', content: 'D4DJ 이벤트 캘린더', hid: 'og:title' },
          { name: 'og:url', content: `https://bushiroad.seiyuus.com${this.$route.fullPath}`, hid: 'og:url' }
        ]
      }
    }
  }
</script>
