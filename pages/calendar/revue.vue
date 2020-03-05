<template>
  <div>
    <client-only>
      <all-calendar project="revue"></all-calendar>
    </client-only>
  </div>
</template>
<script>
  export default {
    head () {
      return {
        title: '레뷰 스타라이트 이벤트 캘린더',
        meta: [
          { name: 'og:title', content: '레뷰 스타라이트 이벤트 캘린더', hid: 'og:title' },
          { name: 'og:url', content: `https://bushiroad.seiyuus.com${this.$route.fullPath}`, hid: 'og:url' }
        ]
      }
    }
  }
</script>
