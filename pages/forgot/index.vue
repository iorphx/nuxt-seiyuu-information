<template>
  <div>
    <base-header class="pb-6" type="">
      <div class="row align-items-center py-4">
        <div class="col-12">
          <h6 class="h2 d-inline-block mb-0">비밀번호 재설정</h6>
          <nav aria-label="breadcrumb" class="d-none d-md-inline-block ml-md-4">
            <ol class="breadcrumb breadcrumb-links">
              <li class="breadcrumb-item"><nuxt-link to="/"><i class="fas fa-home mr-2"></i>홈</nuxt-link></li>
              <li class="breadcrumb-item active" aria-current="page">비밀번호 재설정</li>
            </ol>
          </nav>
        </div>
      </div>
    </base-header>
    
    <div class="container-fluid mt--6">
      <div class="row pt-lg-4" v-if="validEmail">
        <div class="col-lg"></div>
        <div class="col">
          <div class="checklist-item checklist-item-danger mb-4">
            <div class="checklist-info">{{ validEmail.message }}</div>
          </div>
        </div>
        <div class="col-lg"></div>
      </div>
      <div class="row pt-lg-4" v-if="!requested">
        <div class="col-lg"></div>
        <div class="col px-5 px-lg-0">
          <form role="form" @submit.prevent="forgot">
            <base-input label="이메일" placeholder="이메일" type="email" v-model="email"
                        prependIcon="ni ni-email-83" name="이메일" alternative></base-input>
            <div class="text-center">
              <base-button type="primary" class="my-4" @click="forgot()">확인</base-button>
            </div>
          </form>
        </div>
        <div class="col-lg"></div>
      </div>
      <div class="row pt-lg-4" v-else>
        <div class="col">
          <h2>입력하신 메일 주소로 비밀번호 재설정 메일을 발송했습니다.</h2>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import BaseHeader from '@/components/argon-core/BaseHeader';
  import RouteBreadCrumb from '@/components/argon-core/Breadcrumb/RouteBreadcrumb';
  
  import axios from 'axios'
  
  export default {
    layout: 'DashboardLayout',
    components: {
      BaseHeader,
      RouteBreadCrumb
    },
    data() {
      return {
        email: '',
        validEmail: null,
        requested: false
      };
    },
    methods: {
      validateEmail(email) {
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return re.test(email)
      },
      async forgot() {
        try {
          if (this.validateEmail(this.email) === false) throw Error('올바른 형식의 이메일을 입력해주세요.')
          let email = this.email
          axios
            .post('/api/forgot', { email })
            .then(res => {
              if (res.status === 200) this.requested = true
            })
            .catch(err => {
              this.$sentry.captureException(err)
              this.validEmail = ({ message: '존재하지 않는 계정입니다.' })
            })
        } catch (error) {
          this.validEmail = error
        }
      }
    }
  };
</script>
<style>
</style>
