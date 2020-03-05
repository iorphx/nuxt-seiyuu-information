<template>
  <div>
    <client-only>
      <all-calendar project="bandori"></all-calendar>
    </client-only>
  </div>
</template>
<script>
  export default {
    head () {
      return {
        title: 'BanG Dream! 이벤트 캘린더',
        meta: [
          { name: 'og:title', content: 'BanG Dream! 이벤트 캘린더', hid: 'og:title' },
          { name: 'og:url', content: `https://bushiroad.seiyuus.com${this.$route.fullPath}`, hid: 'og:url' }
        ]
      }
    }
  }
</script>
