<template>
  <div>
    <base-header class="pb-6" type="">
      <div class="row align-items-center py-4">
        <div class="col-lg-8 col-3">
          <h6 class="h2 d-inline-block mb-0">굿즈</h6>
          <nav aria-label="breadcrumb" class="d-none d-md-inline-block ml-md-4">
            <ol class="breadcrumb breadcrumb-links">
              <li class="breadcrumb-item"><nuxt-link to="/"><i class="fas fa-home mr-2"></i>홈</nuxt-link></li>
              <li class="breadcrumb-item active" aria-current="page">굿즈</li>
            </ol>
          </nav>
        </div>
        <div class="col-lg-1 col-3 p-0 text-right" v-if="this.$store.state.authUser">
          <base-button outline type="default" v-if="['editor', 'admin'].includes(this.$store.state.authUser.role)" @click="$router.push('/goods/edit')">추가</base-button>
        </div>
        <div class="col-lg-1 col-3 p-0" v-else></div>
        <div class="col-lg-3 col-6 text-lg-right">
          <base-input formGroupClasses="my-0" placeholder="검색..." v-model="keyword" prependIcon="fas fa-search" @keyup="onType"></base-input>
        </div>
      </div>
    </base-header>
    
    <div class="container-fluid mt--6">
      <div class="row">
        <div class="col-lg-4 col-12" v-for="goods in goodsFiltered" :key="goods.name">
          <nuxt-link :to="`/goods/${encodeURIComponent(goods.name)}`">
            <card>
              <div class="row align-items-center">
                <!--<h6 class="price">{{ goods.price }}</h6>-->
                <div class="col-auto p-2">
                  <img v-lazy="goods.image"
                       class="img-fluid shadow shadow-lg--hover"
                       style="width: 150px;" v-if="goods.image">
                  <img src="https://dummyimage.com/450x450/bbbbbb/ffffff&text=no+image"
                       v-else class="img-fluid shadow shadow-lg--hover"
                       style="width: 150px;">
                </div>
                <div class="col ml--2">
                  <h3 class="font-weight-700 mb-0">
                    {{ goods.name }}
                  </h3>
                  <p class="text-sm text-muted mb-0">{{ goods.nameJP }}</p>
                  <span>
                    <badge rounded type="primary" v-for="tag in goods.tags" :key="tag" class="mr-1">{{ tag }}</badge>
                  </span>
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
  import BaseHeader from '@/components/argon-core/BaseHeader';
  import RouteBreadCrumb from '@/components/argon-core/Breadcrumb/RouteBreadcrumb';
  
  export default {
    head () {
      return {
        title: '굿즈',
        meta: [
          { name: 'og:title', content: '굿즈', hid: 'og:title', template: chunk => `${chunk} - 부시로드 성우 정보` },
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
        goodsList: [],
        goodsFiltered: [],
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
          this.goodsFiltered.push(...this.paginatedList)
          $state.loaded()
        } else {
          $state.complete()
        }
      },
      async onLoad() {
        this.goodsList = await this.$axios.$get(`/api/goods/list`)
        this.goodsFiltered.push(...this.paginatedList)
      },
      async onType() {
        this.goodsFiltered.length = 0
        this.page = 1
        this.$refs.InfiniteLoading.stateChanger.reset()
        this.goodsFiltered.push(...this.paginatedList)
      }
    },
    computed: {
      filteredList() {
        return this.goodsList.filter(goods => {
          return (goods.name.toLowerCase().includes(this.keyword.toLowerCase()) ||
            goods.nameJP.includes(this.keyword.toLowerCase()) ||
            goods.tags.join().toLowerCase().includes(this.keyword.toLowerCase()) )
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
.price {
  position: absolute;
  top: 10%;
  right: 6%;
}

@media (max-width: 720px) {
  .price {
    position: absolute;
    top: 10%;
    right: 6%;
  }
}
</style>
