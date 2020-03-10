<template>
  <div>
    <base-header class="pb-6" type="">
      <div class="row align-items-center py-4">
        <div class="col-6 col-lg-9">
          <h6 class="h2 d-inline-block mb-0">{{$route.params.name}}</h6>
          <nav aria-label="breadcrumb" class="d-none d-md-inline-block ml-md-4">
            <ol class="breadcrumb breadcrumb-links">
              <li class="breadcrumb-item"><nuxt-link to="/"><i class="fas fa-home mr-2"></i>홈</nuxt-link></li>
              <li class="breadcrumb-item"><nuxt-link to="/seiyuu">성우</nuxt-link></li>
              <li class="breadcrumb-item active" aria-current="page">{{$route.params.name}}</li>
            </ol>
          </nav>
        </div>
        <div class="col-6 col-lg-3 d-flex justify-content-end" v-if="this.$store.state.authUser">
          <base-button outline type="default" v-if="['editor', 'admin'].includes(this.$store.state.authUser.role)" @click="$router.push(`/seiyuu/edit/${$route.params.name}`)">수정</base-button>
          <base-button outline type="danger" v-if="['editor', 'admin'].includes(this.$store.state.authUser.role)" @click="deleteSeiyuu(seiyuu._id)">삭제</base-button>
        </div>
      </div>
    </base-header>
    
    <div class="container-fluid mt--6">
      <div class="row">
        <div class="col-12">
          <card>
            <div class="row justify-content-center">
              <div class="col-lg-3 order-lg-2">
                <img v-lazy="seiyuu.image" class="img-center rounded-circle" style="width:200px;height:200px;object-fit:cover;" v-if="seiyuu.image">
                <img src="https://dummyimage.com/450x450/bbbbbb/ffffff&text=no+image" class="img-center rounded-circle" style="width:200px;" v-else>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <div class="card-profile-stats d-flex justify-content-center">
                  <div>
                    <span class="d-block display-4">{{ seiyuu.name }}</span>
                    <span class="text-muted">{{ seiyuu.japaneseName }}</span>
                    <span class="text-muted d-block"><small>{{ seiyuu.englishPr }}</small></span>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <div class="row card-profile-stats d-flex justify-content-center">
                  <div class="col-6 col-lg-3 mx-0 p-0 mb-4" v-if="seiyuu.birthday">
                    <span class="heading">{{ seiyuu.birthday }}</span>
                    <span class="description">생년월일</span>
                  </div>
                  <div class="col-6 col-lg-3 mx-0 p-0 mb-4" v-if="seiyuu.age">
                    <span class="heading">{{ seiyuu.age }}세</span>
                    <span class="description">나이</span>
                  </div>
                  <div class="col-6 col-lg-3 mx-0 p-0 mb-4" v-if="seiyuu.constellation">
                    <span class="heading">{{ seiyuu.constellation }}</span>
                    <span class="description">별자리</span>
                  </div>
                  <div class="col-6 col-lg-3 mx-0 p-0 mb-4" v-if="seiyuu.blood">
                    <span class="heading">{{ seiyuu.blood }}형</span>
                    <span class="description">혈액형</span>
                  </div>
                  <div class="col-6 col-lg-3 mx-0 p-0 mb-4" v-if="seiyuu.height">
                    <span class="heading">{{ seiyuu.height }}cm</span>
                    <span class="description">신장</span>
                  </div>
                  <div class="col-6 col-lg-3 mx-0 p-0 mb-4" v-if="seiyuu.born">
                    <span class="heading">{{ seiyuu.born }}</span>
                    <span class="description">출신지</span>
                  </div>
                  <div class="col-6 col-lg-3 mx-0 p-0 mb-4" v-if="seiyuu.specialty">
                    <span class="heading">{{ seiyuu.specialty }}</span>
                    <span class="description">특기</span>
                  </div>
                  <div class="col-6 col-lg-3 mx-0 p-0 mb-4" v-if="seiyuu.hobbies">
                    <span class="heading">{{ seiyuu.hobbies }}</span>
                    <span class="description">취미</span>
                  </div>
                  <div class="col-6 col-lg-3 mx-0 p-0 mb-4" v-if="seiyuu.agent">
                    <span class="heading">{{ seiyuu.agent }}</span>
                    <span class="description">소속사</span>
                  </div>
                  <div class="col-12">
                    <el-tooltip content="트위터" placement="bottom" v-if="seiyuu.links.twitter">
                      <base-button target="_blank" tag="a"
                                   :href="seiyuu.links.twitter" type="outline-default"
                                   class="btn-icon-only"><span class="btn-inner--icon"><i class="fab fa-twitter"></i></span></base-button>
                    </el-tooltip>
                    <el-tooltip content="인스타그램" placement="bottom" v-if="seiyuu.links.instagram">
                      <base-button target="_blank" tag="a"
                                   :href="seiyuu.links.instagram" type="outline-default"
                                   class="btn-icon-only"><span class="btn-inner--icon"><i class="fab fa-instagram"></i></span></base-button>
                    </el-tooltip>
                    <el-tooltip content="블로그" placement="bottom" v-if="seiyuu.links.blog">
                      <base-button target="_blank" tag="a"
                                   :href="seiyuu.links.blog" type="outline-default"
                                   class="btn-icon-only"><span class="btn-inner--icon"><i class="fas fa-blog"></i></span></base-button>
                    </el-tooltip>
                    <el-tooltip content="홈페이지" placement="bottom" v-if="seiyuu.links.homepage">
                      <base-button target="_blank" tag="a"
                                   :href="seiyuu.links.homepage" type="outline-default"
                                   class="btn-icon-only"><span class="btn-inner--icon"><i class="fas fa-home"></i></span></base-button>
                    </el-tooltip>
                    <el-tooltip content="소속사 페이지" placement="bottom" v-if="seiyuu.links.agentpage">
                      <base-button target="_blank" tag="a"
                                   :href="seiyuu.links.agentpage" type="outline-default"
                                   class="btn-icon-only"><span class="btn-inner--icon"><i class="fas fa-address-card"></i></span></base-button>
                    </el-tooltip>
                  </div>
                </div>
              </div>
            </div>
          </card>
        </div>
        <div class="col-12">
          <card>
            <h1 class="display-4 mb-0" slot="header">활동</h1>
            <template v-for="activity in seiyuu.activities">
              <h3 class="card-title mb-1">{{ activity.title }}</h3>
              <ul>
                <li v-for="content in activity.contents">{{ content.value }}</li>
              </ul>
            </template>
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
    asyncData ({ params, $axios, $sentry }) {
      let name = encodeURI(params.name)
      return $axios.$get(`/api/seiyuu/${name}`)
        .then(data => {
          let date = new Date()
          let birthDate = new Date(data.birthday)
          data.age = date.getFullYear() - birthDate.getFullYear()
          if (data.birthday) data.birthday = birthDate.toLocaleDateString('ko-KR', {year:'numeric', month: 'long', day: 'numeric'})
          return {
            seiyuu: data
          }
        })
        .catch(err => {
          $sentry.captureException(err)
        })
    },
    head () {
      return {
        title: this.$route.params.name,
        meta: [
          { name: 'og:title', content: this.$route.params.name, hid: 'og:title' },
          { name: 'og:url', content: `https://bushiroad.seiyuus.com${this.$route.fullPath}`, hid: 'og:url' },
          { name: 'og:image', content: `https://bushiroad.seiyuus.com${this.seiyuu.image}`, hid: 'og:image' }
        ]
      }
    },
    components: {
      BaseHeader,
      RouteBreadCrumb
    },
    data() {
      return {
        seiyuu: {
          name: '',
          japaneseName: '',
          englishPr: '',
          birthday: '',
          age: '',
          constellation: '',
          blood: '',
          height: '',
          hobbies: '',
          specialty: '',
          agent: '',
          born: '',
          image: '',
          links: {twitter: '', instagram: '', blog: '', homepage: '', agentpage: ''},
          activities: []
        }
      }
    },
    methods: {
      deleteSeiyuu(uid) {
        this.$axios.$delete(`/api/seiyuu/${uid}`)
          .then(data => {
            this.$notify({type: 'success', message: '정보를 성공적으로 삭제 했습니다', timeout: 3000})
            this.$router.push('/seiyuu')
          })
          .catch(err => {
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
          })
      }
    }
  }
</script>
<style>
</style>
