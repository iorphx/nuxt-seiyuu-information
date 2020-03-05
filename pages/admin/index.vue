<template>
  <div>
    <base-header class="pb-6" type="">
      <div class="row align-items-center py-4">
        <div class="col-12">
          <h6 class="h2 d-inline-block mb-0">관리</h6>
          <nav aria-label="breadcrumb" class="d-none d-md-inline-block ml-md-4">
            <ol class="breadcrumb breadcrumb-links">
              <li class="breadcrumb-item"><nuxt-link to="/"><i class="fas fa-home mr-2"></i>홈</nuxt-link></li>
              <li class="breadcrumb-item active" aria-current="page">관리</li>
            </ol>
          </nav>
        </div>
      </div>
    </base-header>
    
    <div class="container-fluid mt--6">
      <div class="row">
        <div class="col-12 col-lg text-center" v-for="content in contents">
          <nuxt-link :to="content.link">
            <card style="border-radius: 1rem;">
              <!-- Card body -->
              <div class="row align-items-center">
                <div class="col">
                  <i class="display-1 text-default" :class="content.icon"></i>
                  <h1 class="display-2 mb-0">
                    {{content.title}}
                  </h1>
                </div>
              </div>
            </card>
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
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
        contents: [
          {
            title: '사용자 관리',
            icon: 'fas fa-users-cog',
            link: '/admin/user'
          },
          {
            title: '메일 전송',
            icon: 'fas fa-mail-bulk',
            link: '/admin/mail'
          },
          {
            title: '서버 로그',
            icon: 'fas fa-server',
            link: '/admin/logs'
          }
        ]
      }
    }
  };
</script>
<style>
</style>
