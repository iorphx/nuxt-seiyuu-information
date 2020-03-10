<template>
  <div>
    <base-header class="pb-6" type="">
      <div class="row align-items-center py-4">
        <div class="col-6 col-lg-9">
          <h6 class="h2 d-inline-block mb-0">{{$route.params.title}}</h6>
          <nav aria-label="breadcrumb" class="d-none d-md-inline-block ml-md-4">
            <ol class="breadcrumb breadcrumb-links">
              <li class="breadcrumb-item"><nuxt-link to="/"><i class="fas fa-home mr-2"></i>홈</nuxt-link></li>
              <li class="breadcrumb-item"><nuxt-link to="/discographies">가사/콜</nuxt-link></li>
              <li class="breadcrumb-item active" aria-current="page">{{$route.params.title}}</li>
            </ol>
          </nav>
        </div>
        <div class="col-6 col-lg-3 d-flex justify-content-end" v-if="this.$store.state.authUser">
          <base-button outline type="default" v-if="['editor', 'admin'].includes(this.$store.state.authUser.role)" @click="$router.push(`/discographies/edit/${encodeURIComponent($route.params.title)}`)">수정</base-button>
          <base-button outline type="danger" v-if="['editor', 'admin'].includes(this.$store.state.authUser.role)" @click="deleteSong(info._id)">삭제</base-button>
        </div>
      </div>
    </base-header>
    
    <div class="container-fluid mt--6">
      <div class="row">
        <div class="col-12">
          <card>
            <h1 class="display-4 mb-0" slot="header">정보</h1>
            <div class="row justify-content-center">
              <div class="col-lg-5 col-md-12 mb-3 mb-lg-0">
                <img v-lazy="info.image"
                     class="img-center img-fluid shadow shadow-lg--hover"
                     style="width: 450px;" v-if="info.image">
                <img src="https://dummyimage.com/450x450/bbbbbb/ffffff&text=no+image"
                     v-else class="img-center img-fluid shadow shadow-lg--hover"
                     style="width: 450px;">
              </div>
              <div class="col-lg-7 col-md-12 my-auto">
                <span class="display-3">{{info.artist}}</span>
                <h1 class="display-2 mb-0">{{info.title}}</h1>
                <span class="text-muted display-4">{{info.titleKR}}</span>
                <hr class="my-3">
                <div class="row" v-for="data in songInfo">
                  <div class="col-4">
                    <h1 class="display-4">{{data.header}}</h1>
                  </div>
                  <div class="col-8">
                    <h1 class="display-4"><small>{{data.data}}</small></h1>
                  </div>
                </div>
              </div>
            </div>
          </card>
        </div>
        <div class="col-12">
          <card>
            <template slot="header">
              <div class="row">
                <div class="col">
                  <h1 class="display-4 mb-0">가사</h1>
                </div>
                <div class="col-auto">
                  <base-button @click="toggleTooltip">툴팁 {{ tooltip ? '끄기' : '켜기' }}</base-button>
                </div>
              </div>
            </template>
            <div class="row">
              <div class="col-lg-3"></div>
              <div class="col-12 col-lg-6 mx-lg-auto"><vue-aplayer :music="music" showLrc v-if="music"></vue-aplayer></div>
              <div class="col-lg-3"></div>
              <template>
                <div class="col-lg-3 col-md-3"></div>
                <div class="col lead font-weight-normal d-none d-lg-block" v-html="info.lyric"></div>
                <div class="col lead font-weight-normal text-sm d-lg-none" v-html="info.lyric"></div>
                <div class="col-lg-3 col-md-3"></div>
              </template>
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
  
  function processMusic(data) {
    if (data.music) {
      let url = encodeURI(data.image)
      return {
        title: data.title,
        artist: data.artist,
        src: 'https://drive.google.com/uc?export=download&id=' + data.music,
        pic: url
      }
    } else {
      return null
    }
  }
  
  export default {
    components: {
      BaseHeader,
      RouteBreadCrumb
    },
    data() {
      return {
        info: [],
        songInfo: [],
        music: null,
        tooltip: false
      }
    },
    asyncData ({ params, $axios, $sentry }) {
      let title = encodeURIComponent(params.title)
      return $axios.$get(`/api/discography/${title}`)
        .then(data => {
          return {
            info: data,
            songInfo: [
              {header: '작사', data: data.lyricist},
              {header: '작곡', data: data.composer},
              {header: '편곡', data: data.arrange},
              {header: '출시일', data: data.release}
            ],
            music: processMusic(data)
          }
        })
        .catch(err => {
          $sentry.captureException(err)
        })
    },
    head () {
      return {
        title: this.info.title,
        meta: [
          { name: 'og:title', content: this.info.title, hid: 'og:title' },
          { name: 'og:url', content: `https://bushiroad.seiyuus.com${this.$route.fullPath}`, hid: 'og:url' },
          { name: 'og:image', content: `https://bushiroad.seiyuus.com${this.info.image}`, hid: 'og:image' }
        ]
      }
    },
    mounted() {
      this.toggleTooltip()
    },
    methods: {
      deleteSong(uid) {
        this.$axios.$delete(`/api/discography/${uid}`)
          .then(res => {
            this.$notify({type: 'success', message: '정보를 성공적으로 삭제 했습니다', timeout: 3000})
            this.$router.push('/discographies')
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
      toggleTooltip() {
        if (this.tooltip === true) {
          let p = document.querySelectorAll("P", "SPAN")
          for (let e of p) {
            if (e.hasAttribute("tooltip-title")) {
              let tooltipData = e.getAttribute("tooltip-title")
              e.setAttribute("title", tooltipData)
              e.removeAttribute("tooltip-title")
            }
          }
          this.tooltip = false
        } else {
          let p = document.querySelectorAll("P", "SPAN")
          for (let e of p) {
            if (e.hasAttribute("title")) {
              let tooltipData = e.getAttribute("title")
              e.setAttribute("tooltip-title", tooltipData)
              e.removeAttribute("title")
            }
          }
          this.tooltip = true
        }
      }
    }
  };
</script>
<style>
.aplayer-pic .aplayer-pause .aplayer-icon-pause{
  top: -1.5px !important;
}
p {
  font-size: inherit;
  font-weight: inherit;
  line-height: inherit;
  margin: 0;
}

[tooltip-title]:hover {
	position: relative;
}

[tooltip-title]:after {
	-webkit-transition: bottom .3s ease-in-out, opacity .3s ease-in-out;
	-moz-transition: bottom .3s ease-in-out, opacity .3s ease-in-out;
	transition: bottom .3s ease-in-out, opacity .3s ease-in-out;

	background-color: rgba(0, 0, 0, 0.8);

  -webkit-box-shadow: 0px 0px 3px 1px rgba(50, 50, 50, 0.4);
	-moz-box-shadow: 0px 0px 3px 1px rgba(50, 50, 50, 0.4);
	box-shadow: 0px 0px 3px 1px rgba(50, 50, 50, 0.4);
	
  -webkit-border-radius: 5px;
	-moz-border-radius: 5px;
	border-radius: 5px;
	
  color: #FFFFFF;
	font-size: 12px;
	margin-bottom: 10px;
	padding: 7px 12px;
	position: absolute;
	width: auto;
	min-width: 50px;
	max-width: 400px;
	word-wrap: break-word;

	z-index: 9999;

	opacity: 0;
	left: -9999px;
  top: 90%;
	
	content: attr(tooltip-title);
}

[tooltip-title]:hover:after {
	top: 100%;
	left: 0;
	opacity: 1;
}
</style>
