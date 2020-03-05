<template>
  <div class="wrapper">
    <notifications></notifications>
    <side-bar logo="/img/brand/logo-gray.png">
      <template slot-scope="props" slot="links">
        <sidebar-item
          :link="{
            name: '홈',
            icon: 'fas fa-home text-primary',
            path: '/'
          }"
        >
        </sidebar-item>

        <sidebar-item :link="{
                  name: '성우',
                  icon: 'ni ni-single-02 text-gray'
                  }">
          <sidebar-item :link="{ name: '홈', path: '/seiyuu' }"/>
          <sidebar-item :link="{ name: '프로젝트' }">
            <sidebar-item :link="{ name: 'BanG Dream!', path: '/seiyuu/sp/bandori' }"/>
            <sidebar-item :link="{ name: '레뷰 스타라이트', path: '/seiyuu/sp/revue' }"/>
            <sidebar-item :link="{ name: 'D4DJ', path: '/seiyuu/sp/d4dj' }"/>
            <!--
            <sidebar-item :link="{ name: 'Re버스 for you', path: '/seiyuu/sp/rebirth' }"/>
            <sidebar-item :link="{ name: '어썰트 릴리', path: '/seiyuu/sp/assaultlily' }"/>
            -->
          </sidebar-item>
        </sidebar-item>

        <sidebar-item :link="{
                  name: '가사/콜',
                  icon: 'ni ni-note-03 text-info'
                }">
          <sidebar-item :link="{ name: '홈', path: '/discographies' }"/>
          <sidebar-item :link="{ name: '프로젝트' }">
            <sidebar-item :link="{ name: 'BanG Dream!', path: '/discographies/bandori' }"/>
            <sidebar-item :link="{ name: '레뷰 스타라이트', path: '/discographies/revue' }"/>
            <sidebar-item :link="{ name: 'D4DJ', path: '/discographies/d4dj' }"/>
            <sidebar-item :link="{ name: '어썰트 릴리', path: '/discographies/assaultlily' }"/>
          </sidebar-item>
        </sidebar-item>
        
        <sidebar-item :link="{
                        name: '노래방',
                        icon: 'fas fa-microphone-alt text-pink'
                      }">
          <sidebar-item :link="{ name: '홈', path: '/karaoke' }"/>
          <sidebar-item :link="{ name: '신곡' }">
            <sidebar-item :link="{ name: 'TJ', path:'/karaoke/release/tj' }"/>
            <sidebar-item :link="{ name: 'KY', path:'/karaoke/release/kumyoung' }"/>
            <sidebar-item :link="{ name: 'JOYSOUND', path:'/karaoke/release/joysound' }"/>
            <sidebar-item :link="{ name: 'DAM', path:'/karaoke/release/dam' }"/>
            <sidebar-item :link="{ name: 'UGA', path:'/karaoke/release/uga' }"/>
          </sidebar-item>
          <sidebar-item :link="{ name: '노래방 번호표' }">
            <sidebar-item :link="{ name: 'BanG Dream!', path:'/karaoke/sp/bandori' }"/>
            <sidebar-item :link="{ name: '레뷰 스타라이트', path:'/karaoke/sp/revue' }"/>
            <!--<sidebar-item :link="{ name: 'D4DJ', path:'/karaoke/sp/d4dj' }"/>-->
          </sidebar-item>
        </sidebar-item>
        
        <sidebar-item :link="{
                        name: '굿즈',
                        icon: 'ni ni-cart text-green'
                      }">
          <sidebar-item :link="{ name: '홈', path: '/goods' }"/>
          <sidebar-item :link="{ name: '프로젝트' }">
            <sidebar-item :link="{ name: 'BanG Dream!', path: '/goods/bandori' }"/>
            <sidebar-item :link="{ name: '레뷰 스타라이트', path: '/goods/revue' }"/>
            <sidebar-item :link="{ name: 'D4DJ', path: '/goods/d4dj' }"/>
            <sidebar-item :link="{ name: 'Re버스 for you', path: '/goods/rebirth' }"/>
            <sidebar-item :link="{ name: '어썰트 릴리', path: '/goods/assaultlily' }"/>
          </sidebar-item>
        </sidebar-item>
        
        <sidebar-item :link="{
                        name: '캘린더',
                        icon: 'ni ni-calendar-grid-58 text-red'
                      }">
          <sidebar-item :link="{ name: '홈', path: '/calendar' }"/>
          <sidebar-item :link="{ name: '프로젝트' }">
            <sidebar-item :link="{ name: 'BanG Dream!', path: '/calendar/bandori' }"/>
            <sidebar-item :link="{ name: '레뷰 스타라이트', path: '/calendar/revue' }"/>
            <sidebar-item :link="{ name: 'D4DJ', path: '/calendar/d4dj' }"/>
            <sidebar-item :link="{ name: 'Re버스 for you', path: '/calendar/rebirth' }"/>
            <sidebar-item :link="{ name: '어썰트 릴리', path: '/calendar/assaultlily' }"/>
          </sidebar-item>
        </sidebar-item>
        
        <sidebar-item :link="{
                        name: '번역',
                        icon: 'ni ni-archive-2 text-gray-dark',
                        path: '/translation'
                      }">
        </sidebar-item>
        
        <sidebar-item :link="{
                        name: '유틸리티',
                        icon: 'ni ni-ruler-pencil text-warning'
                      }">
          <sidebar-item :link="{ name: 'LINE M3U8 변환기', path: '/utils/line-m3u8' }"/>
        </sidebar-item>
      </template>
    </side-bar>
    <div class="main-content">
      <dashboard-navbar :type="$route.name === 'alternative' ? 'light': 'default'"></dashboard-navbar>
      <div @click="$sidebar.displaySidebar(false)">
        <nuxt></nuxt>
      </div>
      <content-footer v-if="!$route.meta.hideFooter" @click="$sidebar.displaySidebar(false)"></content-footer>
    </div>
  </div>
</template>
<script>
  /* eslint-disable no-new */
  import PerfectScrollbar from 'perfect-scrollbar'
  import 'perfect-scrollbar/css/perfect-scrollbar.css'

  function hasElement(className) {
    return document.getElementsByClassName(className).length > 0
  }

  function initScrollbar(className) {
    if (hasElement(className)) {
      new PerfectScrollbar(`.${className}`)
    } else {
      // try to init it later in case this component is loaded async
      setTimeout(() => {
        initScrollbar(className)
      }, 100)
    }
  }

  import DashboardNavbar from '~/components/layouts/argon/DashboardNavbar.vue'
  import ContentFooter from '~/components/layouts/argon/ContentFooter.vue'
  import DashboardContent from '~/components/layouts/argon/Content.vue'
  import BackToTop from 'vanilla-back-to-top'

  export default {
    components: {
      DashboardNavbar,
      ContentFooter,
      DashboardContent
    },
    methods: {
      initScrollbar() {
        let isWindows = navigator.platform.startsWith('Win')
        if (isWindows) {
          initScrollbar('scrollbar-inner')
        }
      }
    },
    mounted() {
      this.initScrollbar()
      BackToTop.addBackToTop({
        backgroundColor: 'white',
        scrollDuration: 1000,
        showWhenScrollTopIs: 300,
        textColor: '#172b4d'
      })
    }
  };
</script>
<style>
  #back-to-top {
    background: white !important;
    color: #172b4d !important;
  }

  * {
    font-family: 'Open Sans', 'Noto Sans KR', 'Noto Sans JP', sans-serif;
  }
</style>