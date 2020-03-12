<template>
  <div>
    <base-header class="pb-6" type="">
      <div class="row align-items-center py-4">
        <div class="col-12">
          <h6 class="h2 d-inline-block mb-0">비밀번호 초기화</h6>
          <nav aria-label="breadcrumb" class="d-none d-md-inline-block ml-md-4">
            <ol class="breadcrumb breadcrumb-links">
              <li class="breadcrumb-item"><nuxt-link to="/"><i class="fas fa-home mr-2"></i>홈</nuxt-link></li>
              <li class="breadcrumb-item active" aria-current="page">비밀번호 초기화</li>
            </ol>
          </nav>
        </div>
      </div>
    </base-header>
    
    <div class="container-fluid mt--6">
      <div class="row" v-if="loading">
        <div class="col-12 vh-100">
          <img class="img-center h-50" src="/loading.svg">
        </div>
      </div>
      <div class="row pt-lg-4" v-if="submitError">
        <div class="col-lg"></div>
        <div class="col">
          <div class="checklist-item checklist-item-danger mb-4">
            <div class="checklist-info">{{ submitError.message }}</div>
          </div>
        </div>
        <div class="col-lg"></div>
      </div>
      <div class="row pt-lg-4" v-if="tokenValid === true">
        <div class="col-lg"></div>
        <div class="col px-5 px-lg-0">
          <form role="form" @submit.prevent="submit">
            <base-input label="비밀번호" type="password" name="비밀번호" v-model="password" prependIcon="ni ni-lock-circle-open"
                        alternative placeholder="비밀번호"></base-input>
            <base-input label="비밀번호 재확인" type="password" name="비밀번호" v-model="passwordAgain" prependIcon="ni ni-lock-circle-open"
                        alternative placeholder="비밀번호"></base-input>
            <div class="text-center">
              <base-button type="primary" class="my-4" @click="submit()">비밀번호 변경</base-button>
            </div>
          </form>
        </div>
        <div class="col-lg"></div>
      </div>
      <div class="row" v-else>
        <div class="col-12">
          <h1>{{ message }}</h1>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import BaseHeader from '@/components/argon-core/BaseHeader';
  import RouteBreadCrumb from '@/components/argon-core/Breadcrumb/RouteBreadcrumb';
  
  export default {
    components: {
      BaseHeader,
      RouteBreadCrumb
    },
    data() {
      return {
        tokenValid: null,
        errored: false,
        message: null,
        password: '',
        passwordAgain: '',
        submitError: null
      };
    },
    mounted() {
      this.$axios.$get(`/api/reset/${this.$route.params.token}`)
        .then(res => {
          this.tokenValid = true
        })
        .catch(err => {
          if (err.response.status === 404) this.tokenValid = false
          this.errored = true
          this.message = err.response.data.message
          this.$sentry.captureException(err)
        })
    },
    methods: {
      async submit() {
        try {
          if (this.password !== this.passwordAgain) throw Error('비밀번호가 일치하지 않습니다')
          await this.$store.dispatch('reset', {
            token: this.$route.params.token,
            password: this.password
          }).then(() => {
            this.$router.push('/')
          })
        } catch (err) {
          let sentry = this.$sentry.captureException(err)
          this.$sentry.showReportDialog({
            eventId: sentry.eventId,
            title: '오류가 발생했습니다.',
            subtitle: '어떤 오류가 발생했는지 알려주세요!',
            subtitle2: '',
            labelName: '닉네임',
            labelEmail: '이메일',
            labelComments: '어떻게 오류가 발생했나요?',
            labelClose: '닫기',
            labelSubmit: '보내기',
            errorGeneric: '오류 보고서를 제출하는 도중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
            errorFormEntry: '일부 필드에 내용이 작성되어있지 않습니다. 모든 필드를 채워주신 후 다시 시도해주세요.',
            successMessage: '피드백이 전송되었습니다. 감사합니다!'
          })
          this.submitError = err
        }
      }
    }
  };
</script>
<style>
</style>
