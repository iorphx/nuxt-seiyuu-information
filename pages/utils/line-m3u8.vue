<template>
  <div>
    <base-header class="pb-6" type="">
      <div class="row align-items-center py-4">
        <div class="col-12">
          <h6 class="h2 d-inline-block mb-0">LINE LIVE M3U8 링크 추출기</h6>
          <nav aria-label="breadcrumb" class="d-none d-md-inline-block ml-md-4">
            <ol class="breadcrumb breadcrumb-links">
              <li class="breadcrumb-item"><nuxt-link to="/"><i class="fas fa-home mr-2"></i>홈</nuxt-link></li>
              <li class="breadcrumb-item active" aria-current="page">LINE LIVE M3U8 링크 추출기</li>
            </ol>
          </nav>
        </div>
      </div>
    </base-header>
    
    <div class="container-fluid mt--6">
      <div class="row">
        <div class="col-12">
          <card>
            <div class="row">
              <div class="col-auto my-auto">
                <base-checkbox v-model="isLive" class="font-weight-bold">생방송</base-checkbox>
              </div>
              <div class="col">
                <base-input formGroupClasses="mb-0" v-model="url"></base-input>
              </div>
              <div class="col-auto">
                <base-button @click="getm3u8">확인</base-button>
              </div>
            </div>
            <div class="row" v-if="m3u8 || errored">
              <div class="col text-truncate">
                <hr>
                <div class="col-12 mb-3">
                  <video-player v-if="m3u8" class="mx-auto" :options="playerOptions"></video-player>
                </div>
                <a :href="m3u8" target="_blank" v-if="m3u8">{{ m3u8 }}</a>
                <p v-if="errored">오류가 발생하였습니다.<br>{{ errored }}</p>
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
  
  export default {
    components: {
      BaseHeader,
      RouteBreadCrumb
    },
    head() {
      return {
        title: 'LINE LIVE M3U8 링크 추출기',
        meta: [
          { name: 'og:title', content: 'LINE LIVE M3U8 링크 추출기', hid: 'og:title' },
          { name: 'og:url', content: `https://bushiroad.seiyuus.com${this.$route.fullPath}`, hid: 'og:url' }
        ]
      }
    },
    data() {
      return {
        url: "",
        m3u8: "",
        isLive: false,
        errored: "",
        lineUrl: "",
        playerOptions: {
          overNative: true,
          autoplay: false,
          controls: true,
          sourceOrder: true,
          html5: { hls: { withCredentials: false } },
          sources: [
            {
              withCredentials: false,
              type: 'application/x-mpegURL',
              src: ''
            }
          ]
        }
      }
    },
    methods: {
      getm3u8() {
        this.errored = ""
        this.m3u8 = ""
        this.$axios.$post('/api/linelive', { url: this.url })
          .then(data => {
            let html = data
            let uid = html.match(/(?<=live\/ba\/).*?(?=\&quot)/gs)[0]
            if (this.isLive === true) {
              this.lineUrl = `https://lssapi.line-apps.com/v1/live/playInfo?contentId=live/ba/${uid}&scheme=https`
            } else {
              this.lineUrl = `https://lssapi.line-apps.com/v1/vod/playInfo?contentId=live/ba/${uid}&scheme=https`
            }
            this.$axios.$post('/api/linelive', { url: this.lineUrl })
              .then(data => {
                let m3u8 = data.playUrls["720"]
                this.m3u8 = m3u8
                this.playerOptions.sources[0].src = m3u8
              })
              .catch(err => this.errored = err.message)
          })
          .catch(err => this.errored = err.message)
      }
    }
  }
</script>
<style>
p {
  font-size: inherit;
  font-weight: inherit;
  line-height: inherit;
  margin: 0;
}
.video-js {
  height: 480px;
  width: 100%;
}
</style>
