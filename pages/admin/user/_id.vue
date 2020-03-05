<template>
  <div>
    <base-header class="pb-6" type="">
      <div class="row align-items-center py-4">
        <div class="col-12">
          <h6 class="h2 d-inline-block mb-0">사용자 관리</h6>
          <nav aria-label="breadcrumb" class="d-none d-md-inline-block ml-md-4">
            <ol class="breadcrumb breadcrumb-links">
              <li class="breadcrumb-item"><nuxt-link to="/"><i class="fas fa-home mr-2"></i>홈</nuxt-link></li>
              <li class="breadcrumb-item"><nuxt-link to="/admin">관리</nuxt-link></li>
              <li class="breadcrumb-item"><nuxt-link to="/admin/user">사용자 관리</nuxt-link></li>
              <li class="breadcrumb-item active" aria-current="page">{{user.username}}</li>
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
                <form role="form" @submit.prevent="edit">
                  <base-input label="이메일" v-model="user.email" type="email" name="이메일"></base-input>
                  <base-input label="닉네임" v-model="user.username"></base-input>
                  <base-input label="권한">
                    <el-select v-model="user.role">
                      <el-option :value="role.value" :key="role.label" :label="role.label" v-for="role in roles">
                      </el-option>
                    </el-select>
                  </base-input>
                  <div class="text-center">
                    <base-button type="danger" class="my-4" @click="$router.go(-1)">취소</base-button>
                    <base-button type="primary" class="my-4" @click="edit()">수정</base-button>
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
  import { Select, Option } from 'element-ui'
  
  export default {
    middleware: 'admin',
    components: {
      BaseHeader,
      RouteBreadCrumb,
      [Select.name]: Select,
      [Option.name]: Option
    },
    data() {
      return {
        user: {
          email: '',
          username: '',
          role: 'default'
        },
        roles: [
          {value: 'default', label: "기본"},
          {value: 'editor', label: "편집자"},
          {value: 'admin', label: "관리자"}
        ],
        error: false
      }
    },
    mounted () {
      this.$axios.$get(`/api/admin/user/${this.$route.params.id}`)
        .then(data => {
          this.user = data
        })
        .catch(err => {
          console.log(err)
        })
    },
    methods: {
      async edit() {
        try {
          if (!this.user.email || !this.user.username) throw Error('모든 필드를 입력해주세요.')
          this.$axios.$patch(`/api/admin/user/${this.$route.params.id}`, { data: this.user })
            .then(data => {
              this.$notify({type: 'success', message: '정보를 성공적으로 수정하였습니다.', timeout: 3000})
              this.$router.go(-1)
            })
            .catch(err => {
              this.$notify({type: 'danger', message: '오류가 발생했습니다.', timeout: 3000})
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