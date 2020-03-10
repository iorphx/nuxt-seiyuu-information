<template>
  <div>
    <base-header class="pb-6" type="">
      <div class="row align-items-center py-4">
        <div class="col-6 col-lg-9">
          <h6 class="h2 d-inline-block mb-0">{{ titleSlice(article.title) }}</h6>
          <nav aria-label="breadcrumb" class="d-none d-md-inline-block ml-md-4">
            <ol class="breadcrumb breadcrumb-links">
              <li class="breadcrumb-item"><nuxt-link to="/"><i class="fas fa-home mr-2"></i>홈</nuxt-link></li>
              <li class="breadcrumb-item"><nuxt-link to="/translation">번역</nuxt-link></li>
              <li class="breadcrumb-item active" aria-current="page">{{ titleSlice(article.title) }}</li>
            </ol>
          </nav>
        </div>
        <div class="col-6 col-lg-3 d-flex justify-content-end" v-if="this.$store.state.authUser">
          <base-button outline type="default" v-if="this.$store.state.authUser.username === article.author || this.$store.state.authUser.role === 'admin'" @click="$router.push(`/translation/edit/${$route.params.id}`)">수정</base-button>
          <base-button outline type="danger" v-if="this.$store.state.authUser.username === article.author || this.$store.state.authUser.role === 'admin'" 
                       @click="deleteArticle(article._id)">삭제</base-button>
        </div>
      </div>
    </base-header>
    
    <div class="container-fluid mt--6">
      <div class="row">
        <div class="col-12">
          <card>
            <template slot="header">
              <div class="row">
                <div class="col-12 col-lg">
                  <h1 class="display-4 mb-0" >{{ article.title }}</h1>
                </div>
                <div class="col-auto text-lg-right">
                  <small class="text-muted d-block">{{ article.author }}</small>
                  <small class="text-muted">{{ dateToString(article.date) }}</small>
                </div>
              </div>
            </template>
            <div class="row"><div class="col" v-html="article.html"></div></div>
            <template slot="footer" v-if="article.src">
              <p>출처 - <a :href="article.src" target="_blank">{{ article.src }}</a></p>
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
    components: {
      BaseHeader,
      RouteBreadCrumb
    },
    asyncData ({ params, $axios, $sentry }) {
      return $axios.$get(`/api/translation/${params.id}`)
        .then(data => {
          return {
            article: data
          }
        })
        .catch(err => {
          $sentry.captureException(err)
        })
    },
    head () {
      return {
        title: this.article.title,
        meta: [
          { name: 'og:title', content: this.article.title, hid: 'og:title', template: chunk => `${chunk} - 번역 - 부시로드 성우 정보` },
          { name: 'og:url', content: `https://bushiroad.seiyuus.com${this.$route.fullPath}`, hid: 'og:url' }
        ]
      }
    },
    data() {
      return {
        article: {
          title: '',
          html: '',
          date: '',
          author: '',
          tags: []
        }
      }
    },
    methods: {
      deleteArticle(uid) {
        this.$axios.$delete(`/api/translation/${uid}`)
          .then(data => {
            this.$notify({type: 'success', message: '정보를 성공적으로 삭제 했습니다', timeout: 3000})
            this.$router.push('/translation')
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
      },
      titleSlice(t) {
        let tmp = t.slice(0, 10)
        if (tmp[-1] === ' ') tmp[-1] = ''
        if (tmp.length > 9) tmp += '...'
        return tmp
      },
      dateToString(date) {
        date = new Date(date)
        return date.toLocaleDateString('ko-KR', {weekday:'long', year:'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric'})
      }
    }
  };
</script>
<style>
p {
  font-size: inherit;
  font-weight: inherit;
  line-height: inherit;
  margin: 0;
}
img {
  max-width: 100%;
  height: auto;
}
</style>
