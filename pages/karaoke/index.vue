<template>
  <div>
    <base-header class="pb-6" type="">
      <div class="row align-items-center py-4">
        <div class="col-12">
          <h6 class="h2 d-inline-block mb-0">노래방 번호 검색</h6>
          <nav aria-label="breadcrumb" class="d-none d-md-inline-block ml-md-4">
            <ol class="breadcrumb breadcrumb-links">
              <li class="breadcrumb-item"><nuxt-link to="/"><i class="fas fa-home mr-2"></i>홈</nuxt-link></li>
              <li class="breadcrumb-item active" aria-current="page">노래방 번호 검색</li>
            </ol>
          </nav>
        </div>
      </div>
    </base-header>
    
    <div class="container-fluid mt--6">
      <div class="row">
        <div class="col-12 col-lg-6">
          <card>
            <template slot="header">
              <h3 class="mb-0">{{ month }}월 TJ 신곡</h3>
            </template>
            <div>
              <ul class="list-group list-group-flush list my--3">
                <li v-for="song in tjNew" :key="song.no" class="list-group-item px-0 py-2">
                  <div class="row align-items-center px-3">
                    <div class="col">
                      <h5>{{song.title}}</h5>
                    </div>
                    <div class="col-auto">
                      <h5>{{song.no}}</h5>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </card>
        </div>
        
        <div class="col-12 col-lg-6">
          <card>
            <template slot="header">
              <h3 class="mb-0">{{ month }}월 KY 신곡</h3>
            </template>
            <div>
              <ul class="list-group list-group-flush list my--3">
                <li v-for="song in kyNew" :key="song.no" class="list-group-item px-0 py-2">
                  <div class="row align-items-center px-3">
                    <div class="col">
                      <h5>{{song.title}}</h5>
                    </div>
                    <div class="col-auto">
                      <h5>{{song.no}}</h5>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </card>
        </div>
        
        <div class="col-12 col-lg-6">
          <card>
            <template slot="header">
              <h3 class="mb-0">{{ month }}월 JOYSOUND 신곡</h3>
            </template>
            <div>
              <ul class="list-group list-group-flush list my--3">
                <li v-for="song in joysoundNew" :key="song.no" class="list-group-item px-0 py-2">
                  <div class="row align-items-center px-3">
                    <div class="col">
                      <h5>{{song.title}}</h5>
                    </div>
                    <div class="col-auto">
                      <h5>{{song.no}}</h5>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </card>
        </div>
        
        <div class="col-12 col-lg-6">
          <card>
            <template slot="header">
              <h3 class="mb-0">{{ month }}월 DAM 신곡</h3>
            </template>
            <div>
              <ul class="list-group list-group-flush list my--3">
                <li v-for="song in damNew" :key="song.no" class="list-group-item px-0 py-2">
                  <div class="row align-items-center px-3">
                    <div class="col">
                      <h5>{{song.title}}</h5>
                    </div>
                    <div class="col-auto">
                      <h5>{{song.no}}</h5>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </card>
        </div>
        
        <div class="col-12">
          <card>
            <template slot="header">
              <h3 class="mb-0">{{ month }}월 UGA 신곡</h3>
            </template>
            <div>
              <ul class="list-group list-group-flush list my--3">
                <li v-for="song in ugaNew" :key="song.no" class="list-group-item px-0 py-2">
                  <div class="row align-items-center px-3">
                    <div class="col">
                      <h5>{{song.title}}</h5>
                    </div>
                    <div class="col-auto">
                      <h5>{{song.no}}</h5>
                    </div>
                  </div>
                </li>
              </ul>
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
    head () {
      return {
        title: '노래방 번호 검색',
        meta: [
          { name: 'og:title', content: '노래방 번호 검색', hid: 'og:title', template: chunk => `${chunk} - 부시로드 성우 정보` },
          { name: 'og:url', content: `https://bushiroad.seiyuus.com${this.$route.fullPath}`, hid: 'og:url' }
        ]
      }
    },
    components: {
      BaseHeader,
      RouteBreadCrumb
    },
    async asyncData({$axios}) {
      let dt = new Date()
      let month = ('0' + (dt.getMonth() + 1)).slice(-2)
      let m = dt.getMonth() + 1
      let y = dt.getFullYear()
      
      let tjNew = await $axios.$get(`https://api.manana.kr/v2/karaoke/release/${y}${month}.json?brand=tj`)
      let kyNew = await $axios.$get(`https://api.manana.kr/v2/karaoke/release/${y}${month}.json?brand=kumyoung`)
      let joysoundNew = await $axios.$get(`https://api.manana.kr/v2/karaoke/release/${y}${month}.json?brand=joysound`)
      let damNew = await $axios.$get(`https://api.manana.kr/v2/karaoke/release/${y}${month}.json?brand=dam`)
      let ugaNew = await $axios.$get(`https://api.manana.kr/v2/karaoke/release/${y}${month}.json?brand=uga`)
      
      return {
        tjNew: tjNew.data,
        kyNew: kyNew.data,
        joysoundNew: joysoundNew.data,
        damNew: damNew.data,
        ugaNew: ugaNew.data,
        month: m
      }
    }
  };
</script>
<style>
</style>
