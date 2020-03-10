<template>
  <div>
    <base-header class="pb-6" type="">
      <div class="row align-items-center py-4">
        <div class="col-lg-8 col-3">
          <h6 class="h2 d-inline-block mb-0">성우</h6>
          <nav aria-label="breadcrumb" class="d-none d-md-inline-block ml-md-4">
            <ol class="breadcrumb breadcrumb-links">
              <li class="breadcrumb-item"><nuxt-link to="/"><i class="fas fa-home mr-2"></i>홈</nuxt-link></li>
              <li class="breadcrumb-item active" aria-current="page">성우</li>
            </ol>
          </nav>
        </div>
        <div class="col-lg-1 col-3 p-0 text-right" v-if="this.$store.state.authUser">
          <base-button outline type="default" v-if="['editor', 'admin'].includes(this.$store.state.authUser.role)" @click="$router.push('/seiyuu/edit')">추가</base-button>
        </div>
        <div class="col-lg-1 col-3 p-0" v-else></div>
        <div class="col-lg-3 col-6 text-lg-right">
          <base-input formGroupClasses="my-0" placeholder="검색..." v-model="keyword" prependIcon="fas fa-search" @keyup="onType"></base-input>
        </div>
      </div>
    </base-header>
    
    <div class="container-fluid mt--6">
      <div class="row">
        <div class="col-lg-4 col-12" v-for="seiyuu in seiyuuFiltered" :key="seiyuu.name">
          <nuxt-link :to="`/seiyuu/${seiyuu.name}`">
            <card style="border-radius: 1rem;">
              <!-- Card body -->
              <div class="row align-items-center">
                <div class="col-auto p-2">
                  <!-- Avatar -->
                   <img v-lazy="seiyuu.image"
                         class="img-fluid rounded-circle shadow shadow-lg--hover"
                         style="width:150px;height:150px;object-fit:cover;" v-if="seiyuu.image">
                    <img src="https://dummyimage.com/450x450/bbbbbb/ffffff&text=no+image"
                         class="img-fluid rounded-circle shadow shadow-lg--hover"
                         style="width:150px;height:150px;object-fit:cover;" v-else>
                </div>
                <div class="col">
                  <h1 class="display-4 mb-0">
                    {{ seiyuu.name }}
                  </h1>
                  <p class="text-muted mb-0">{{ seiyuu.japaneseName }}</p>
                </div>
              </div>
            </card>
          </nuxt-link>
        </div>
        <infinite-loading @infinite="infiniteHandler" ref="InfiniteLoading" spinner="waveDots">
          <span slot="no-more"></span>
        </infinite-loading>
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
        title: '성우 정보',
        meta: [
          { name: 'og:title', content: '성우 정보', hid: 'og:title', template: chunk => `${chunk} - 부시로드 성우 정보` },
          { name: 'og:url', content: `https://bushiroad.seiyuus.com${this.$route.fullPath}`, hid: 'og:url' }
        ]
      }
    },
    components: {
      BaseHeader,
      RouteBreadCrumb
    },
    data() {
      return {
        seiyuuList: [],
        seiyuuFiltered: [],
        page: 1,
        keyword: ''
      };
    },
    mounted () {
      this.onLoad()
    },
    methods: {
      infiniteHandler($state) {
        let data = this.paginatedList
        if (data.length) {
          this.page += 1
          this.seiyuuFiltered.push(...this.paginatedList)
          $state.loaded()
        } else {
          $state.complete()
        }
      },
      async onLoad() {
        this.seiyuuList = await this.$axios.$get(`/api/seiyuu/list`)
        this.seiyuuFiltered.push(...this.paginatedList)
      },
      async onType() {
        this.seiyuuFiltered.length = 0
        this.page = 1
        this.$refs.InfiniteLoading.stateChanger.reset()
        this.seiyuuFiltered.push(...this.paginatedList)
      }
    },
    computed: {
      filteredList() {
        return this.seiyuuList.filter(seiyuu => {
          return (seiyuu.name.toLowerCase().includes(this.keyword.toLowerCase()) ||
            seiyuu.japaneseName.toLowerCase().includes(this.keyword.toLowerCase()) )
        })
      },
      paginatedList() {
        return this.filteredList.slice(this.from, this.to)
      },
      to() {
        let highBound = this.from + 9;
        if (this.filteredList.length < highBound) {
          highBound = this.filteredList.lengt
        }
        return highBound
      },
      from() {
        return 9 * (this.page - 1)
      }
    }
  };
</script>
<style>
</style>
