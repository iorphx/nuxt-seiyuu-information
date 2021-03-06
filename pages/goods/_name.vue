<template>
  <div>
    <base-header class="pb-6" type="">
      <div class="row align-items-center py-4">
        <div class="col-6 col-lg-9">
          <h6 class="h2 d-inline-block mb-0">{{$route.params.name}}</h6>
          <nav aria-label="breadcrumb" class="d-none d-md-inline-block ml-md-4">
            <ol class="breadcrumb breadcrumb-links">
              <li class="breadcrumb-item"><nuxt-link to="/"><i class="fas fa-home mr-2"></i>홈</nuxt-link></li>
              <li class="breadcrumb-item"><nuxt-link to="/goods">굿즈</nuxt-link></li>
              <li class="breadcrumb-item active" aria-current="page">{{$route.params.name}}</li>
            </ol>
          </nav>
        </div>
        <div class="col-6 col-lg-3 d-flex justify-content-end" v-if="this.$store.state.authUser">
          <template v-if="['editor', 'admin'].includes(this.$store.state.authUser.role)">
            <base-button outline type="default" @click="$router.push(`/goods/edit/${encodeURIComponent($route.params.name)}`)">수정</base-button>
            <base-button outline type="danger" @click="deleteGoods(goods._id)">삭제</base-button>
          </template>
        </div>
      </div>
    </base-header>
    
    <div class="container-fluid mt--6">
      <div class="row">
        <div class="col-12">
          <card>
            <div class="row justify-content-center">
              <div class="col-lg-5 col-md-12 mb-3 mb-lg-0">
                <img v-lazy="goods.image"
                     class="img-center img-fluid"
                     style="width: 450px;" v-if="goods.image">
                <img src="https://dummyimage.com/450x450/bbbbbb/ffffff&text=no+image"
                     class="img-center img-fluid"
                     style="width: 450px;" v-else>
              </div>
              <div class="col-lg-7 col-md-12 my-auto">
                <span>
                  <badge rounded type="primary" v-for="tag in goods.tags" :key="tag" class="mr-1">{{ tag }}</badge>
                </span>
                <h1 class="display-2 mb-0">{{goods.name}}</h1>
                <span class="text-muted display-4">{{goods.japaneseName}}</span>
                <hr class="my-3">
                <div class="row" v-for="info in goodsInfo">
                  <div class="col-4">
                    <h1 class="display-4">{{info.header}}</h1>
                  </div>
                  <div class="col-8">
                    <a :href="goods.link" v-if="info.header === '링크'">
                      <h1 class="display-4" style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">
                        <small>{{info.value}}</small>
                      </h1>
                    </a>
                    <h1 class="display-4" v-else-if="!info.value"><small>정보 없음</small></h1>
                    <h1 class="display-4" v-else><small>{{info.value}}</small></h1>
                  </div>
                </div>
              </div>
              <div class="col-12" v-if="goods.description">
                <hr class="my-3">
                <h1 class="display-4">설명</h1>
                <div v-html="goods.description"></div>
              </div>
            </div>
          </card>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import BaseHeader from '@/components/argon-core/BaseHeader';
  import RouteBreadCrumb from '@/components/argon-core/Breadcrumb/RouteBreadcrumb';
  
  export default {
    asyncData ({ params, $axios, $sentry }) {
      let name = encodeURIComponent(params.name)
      return $axios.$get(`/api/goods/${name}`)
        .then(data => {
          let releaseDate = new Date(data.release)
          if (data.release) data.release = releaseDate.toLocaleDateString('ko-KR', {year:'numeric', month: 'long', day: 'numeric'})
          let goodsInfo = [
            {header: '발매일', value: data.release},
            {header: '가격', value: data.price},
            {header: '종류', value: data.goodsType},
            {header: '링크', value: data.link},
          ]
          return {
            goods: data,
            goodsInfo: goodsInfo
          }
        })
        .catch(err => {
          $sentry.captureException(err)
        })
    },
    head () {
      return {
        title: this.goods.name,
        titleTemplate: '%s - 굿즈 - 부시로드 성우 정보',
        meta: [
          { name: 'og:title', content: this.goods.name, hid: 'og:title', template: chunk => `${chunk} - 굿즈 - 부시로드 성우 정보` },
          { name: 'og:url', content: `https://bushiroad.seiyuus.com${this.$route.fullPath}`, hid: 'og:url' },
          { name: 'og:image', content: `https://bushiroad.seiyuus.com${this.goods.image}`, hid: 'og:image' }
        ]
      }
    },
    components: {
      BaseHeader,
      RouteBreadCrumb
    },
    data() {
      return {
        goods: [],
        goodsInfo: [],
        loading: true,
        errored: false
      }
    },
    methods: {
      deleteGoods(uid) {
        this.$axios.$delete(`/api/goods/${uid}`)
          .then(data => {
            this.$notify({type: 'success', message: '정보를 성공적으로 삭제했습니다.', timeout: 3000})
            this.$router.push('/goods')
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
