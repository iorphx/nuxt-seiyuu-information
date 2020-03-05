<template>
  <div>
    <base-header class="pb-6" type="">
      <div class="row align-items-center py-4">
        <div class="col-12">
          <h6 class="h2 d-inline-block mb-0">{{project}} 성우 정보</h6>
          <nav aria-label="breadcrumb" class="d-none d-md-inline-block ml-md-4">
            <ol class="breadcrumb breadcrumb-links">
              <li class="breadcrumb-item"><nuxt-link to="/"><i class="fas fa-home mr-2"></i>홈</nuxt-link></li>
              <li class="breadcrumb-item"><nuxt-link to="/seiyuu">성우</nuxt-link></li>
              <li class="breadcrumb-item active" aria-current="page">{{project}}</li>
            </ol>
          </nav>
        </div>
      </div>
    </base-header>
    <div class="container-fluid mt--6">
      <div class="row">
        <div class="col-12" v-for="group in info">
          <card class="text-center">
            <h5 class="h3 mb-0" slot="header">{{ group.name }}</h5>
            <template>
              <ul class="list-group list-group-flush list d-inline-flex mx-lg-5 my-4 mx-md-5 mx-5" v-for="member in group.members">
                <img v-lazy="member.image"
                     class="rounded-circle img-center img-fluid shadow shadow-lg--hover"
                     style="width: 200px;">
                <div class="pt-4 text-center">
                  <h5 class="h3 title">
                    <span class="d-block mb-1">{{ member.name }}</span>
                    <small class="h4 font-weight-light text-muted">{{ member.character }}</small>
                  </h5>
                  <div class="mt-3">
                    <el-tooltip content="트위터" placement="bottom" v-if="member.twitter">
                      <base-button target="_blank" tag="a"
                                   :href="member.twitter" type="outline-default"
                                   class="btn-icon-only rounded-circle"><span class="btn-inner--icon"><i class="fab fa-twitter"></i></span></base-button>
                    </el-tooltip>
                    <el-tooltip content="인스타그램" placement="bottom" v-if="member.instagram">
                      <base-button target="_blank" tag="a"
                                   :href="member.instagram" type="outline-default"
                                   class="btn-icon-only rounded-circle"><span class="btn-inner--icon"><i class="fab fa-instagram"></i></span></base-button>
                    </el-tooltip>
                    <el-tooltip content="블로그" placement="bottom" v-if="member.blog">
                      <base-button target="_blank" tag="a"
                                   :href="member.blog" type="outline-default"
                                   class="btn-icon-only rounded-circle"><span class="btn-inner--icon"><i class="fas fa-blog"></i></span></base-button>
                    </el-tooltip>
                    <el-tooltip content="색상코드" placement="bottom" v-if="member.color">
                      <base-button tag="a" type="outline-default" round icon-only
                                   class="btn-icon-only rounded-circle text-default"
                                   v-clipboard:copy="member.color"
                                   v-clipboard:success="onCopy"
                                   v-clipboard:error="onError"><span class="btn-inner--icon"><i class="fas fa-palette"></i></span>
                                   <span class="badge-circle badge-floating border-0" :style="{'background-color':member.color}"
                                         style="transform: translateY(80%) translateX(-50%) !important; width: 1rem !important; height: 1rem !important;">&nbsp; </span></base-button>
                    </el-tooltip>
                  </div>
                </div>
              </ul>
            </template>
          </card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import VueClipboard from 'vue-clipboard2'
  Vue.use(VueClipboard)
  // Components
  import BaseHeader from '@/components/argon-core/BaseHeader'
  import RouteBreadCrumb from '@/components/argon-core/Breadcrumb/RouteBreadcrumb'
  
  export default {
    asyncData ({ params, $axios }) {
      return $axios.$get(`/api/seiyuu/special/${params.project}`)
        .then(data => {
          let projects = [
            {label: 'BanG Dream!', value: 'bandori'},
            {label: '레뷰 스타라이트', value: 'revue'},
            {label: 'D4DJ', value: 'd4dj'},
            {label: 'Re버스 for you', value: 'rebirth'},
            {label: "어썰트 릴리", value: 'assaultlily'}
          ]
          let project = projects.filter(project => project.value === params.project)
          return {
            info: data,
            project: project[0].label
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    head () {
      return {
        title: `${this.project} 성우 정보`,
        meta: [
          { name: 'og:title', content: `${this.project} 성우 정보`, hid: 'og:title' },
          { name: 'og:url', content: `https://bushiroad.seiyuus.com${this.$route.fullPath}`, hid: 'og:url' }
        ]
      }
    },
    components: {
      BaseHeader,
      RouteBreadCrumb
    },
    methods: {
      onCopy() {
        this.$notify({type: 'info', message: '해당 맴버의 색상코드를 복사했습니다.', timeout: 3000})
      },
      onError() {
        this.$notify({type: 'danger', message: '오류가 발생했습니다.', timeout: 3000})
      }
    }
  };
</script>
<style>
a.text-default:hover {
  color: #fff !important;
}
</style>