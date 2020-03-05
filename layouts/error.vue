<template>
  <div>
    <div class="header py-7 py-lg-8 pt-lg-9">
      <div class="container">
        <div class="header-body text-center mb-7">
          <div class="row justify-content-center">
            <div class="col px-5">
              <h1 class="mb-1">페이지를 표시하는 중에 문제가 발생하였습니다.</h1>
              <p class="text-lead font-weight-bold">권한이 필요한 페이지에 접속을 시도하였거나 서버내부 오류가 발생했습니다.<br/><small>{{ error.message }}</small></p>
              <nuxt-link to="/" class="font-weight-bold mt-5">홈페이지로 이동</nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    error: {
      type: Object,
      default: null
    }
  }
}
</script>