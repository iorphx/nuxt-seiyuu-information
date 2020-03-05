<template>
  <div>
    <base-header class="pb-6" type="">
      <div class="row align-items-center py-4">
        <div class="col-lg-8 col-4">
          <h6 class="h2 d-inline-block mb-0">사용자 관리</h6>
          <nav aria-label="breadcrumb" class="d-none d-md-inline-block ml-md-4">
            <ol class="breadcrumb breadcrumb-links">
              <li class="breadcrumb-item"><nuxt-link to="/"><i class="fas fa-home mr-2"></i>홈</nuxt-link></li>
              <li class="breadcrumb-item"><nuxt-link to="/admin">관리</nuxt-link></li>
              <li class="breadcrumb-item active" aria-current="page">사용자 관리</li>
            </ol>
          </nav>
        </div>
        <div class="col-lg-4 col-8 text-lg-right">
          <base-input formGroupClasses="my-0" placeholder="검색..." v-model="keyword" prependIcon="fas fa-search"></base-input>
        </div>
      </div>
    </base-header>
    
    <div class="container-fluid mt--6">
      <div class="row">
        <div class="col-12 col-lg-3" v-for="user in filteredList" :key="user.name">
          <card style="border-radius: 1rem;">
            <!-- Card body -->
            <div class="row align-items-center">
              <div class="col" @click="$router.push(`/admin/user/${user._id}`)">
                <h1 class="display-4 mb-0">
                  {{ user.username }}
                  <span class="d-inline-flex text-sm">{{ user.role }}</span>
                </h1>
                <p class="text-muted mb-0">{{ user.email }}</p>
              </div>
              <div class="col-auto mr-3" @click="$router.push(`/admin/mail/${user._id}`)">
                <div><i class="ni ni-email-83"></i></div>
              </div>
            </div>
          </card>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  // Components
  import BaseHeader from '@/components/argon-core/BaseHeader';
  import RouteBreadCrumb from '@/components/argon-core/Breadcrumb/RouteBreadcrumb';
  
  export default {
    middleware: 'admin',
    components: {
      BaseHeader,
      RouteBreadCrumb
    },
    data() {
      return {
        users: [],
        keyword: ''
      };
    },
    mounted() {
      this.$axios.$get('/api/admin/users')
        .then(data => {
          data.filter(user => {
            if(user.role === 'editor') {
              return user.role = '편집자'
            } else {
              return user.role = '기본'
            }
          })
          this.users = data
        })
        .catch(err => {
          console.log(err)
        })
    },
    computed: {
      filteredList() {
        return this.users.filter(user => {
          return (user.username.toLowerCase().includes(this.keyword.toLowerCase()) ||
            user.email.toLowerCase().includes(this.keyword.toLowerCase()) )
        })
      }
    }
  };
</script>
<style>
</style>