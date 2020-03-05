<template>
  <div>
    <client-only>
      <all-calendar-edit :project="$route.query.project"></all-calendar-edit>
    </client-only>
  </div>
</template>
<script>
  export default {
    middleware: 'editor'
  }
</script>
