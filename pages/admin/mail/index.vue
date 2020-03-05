<template>
  <div>
    <base-header class="pb-6" type="">
      <div class="row align-items-center py-4">
        <div class="col-12">
          <h6 class="h2 d-inline-block mb-0">메일 전송</h6>
          <nav aria-label="breadcrumb" class="d-none d-md-inline-block ml-md-4">
            <ol class="breadcrumb breadcrumb-links">
              <li class="breadcrumb-item"><nuxt-link to="/"><i class="fas fa-home mr-2"></i>홈</nuxt-link></li>
              <li class="breadcrumb-item"><nuxt-link to="/admin">관리</nuxt-link></li>
              <li class="breadcrumb-item active" aria-current="page">메일 전송</li>
            </ol>
          </nav>
        </div>
      </div>
    </base-header>
    
    <div class="container-fluid mt--6">
      <div class="row">
        <div class="col">
          <card>
            <div class="row" v-if="error">
              <div class="col">
                <div class="checklist-item checklist-item-danger mb-4">
                  <div class="checklist-info">{{ error.message }}</div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <form role="form" @submit.prevent="send">
                  <base-input label="제목" v-model="title"></base-input>
                  <div class="form-group mb-0">
                    <label class="form-control-label d-block">내용</label>
                    <tinymce id="text" v-model="text" :api-key="apikey"
                             :init="initOptions" :plugins="plugin" :toolbar="toolbar">
                    </tinymce>
                  </div>
                  <div class="text-center">
                    <base-button type="primary" class="my-4" @click="send()">전송</base-button>
                  </div>
                </form>
              </div>
            </div>
          </card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import BaseHeader from '@/components/argon-core/BaseHeader'
  import RouteBreadCrumb from '@/components/argon-core/Breadcrumb/RouteBreadcrumb'
  import tinymceMixin from '~/components/mixins/tinymceMixin'
  
  export default {
    mixins: [tinymceMixin],
    middleware: 'admin',
    components: {
      BaseHeader,
      RouteBreadCrumb
    },
    data() {
      return {
        title: '',
        text: '',
        error: null
      }
    },
    methods: {
      async send() {
        try {
          if (!this.text || !this.title) throw Error('모든 필드를 입력해주세요.')
          let subject = this.title
          let text = this.text
          this.$axios.$post('/api/admin/mail/all', { subject, text })
            .then(res => {
              this.$notify({type: 'success', message: '메일을 성공적으로 전송하였습니다.', timeout: 3000})
            })
            .catch(err => {
              this.$notify({type: 'danger', message: '오류가 발생했습니다.', timeout: 3000})
              console.log(err)
            })
        } catch (error) {
          this.error = error
        }
      }
    }
  }
</script>
<style>
</style>