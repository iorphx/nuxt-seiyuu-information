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
            <base-input label="비밀번호" type="password" v-model="password" prependIcon="ni ni-lock-circle-open"
                        alternative placeholder="비밀번호"></base-input>
            <base-input label="비밀번호 재확인" type="password" v-model="passwordAgain" prependIcon="ni ni-lock-circle-open"
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
          console.log(err)
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
          this.submitError = err
        }
      }
    }
  };
</script>
<style>
</style>
