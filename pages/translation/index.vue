<template>
  <div>
    <base-header class="pb-6" type="">
      <div class="row align-items-center py-4">
        <div class="col-lg-8 col-3">
          <h6 class="h2 d-inline-block mb-0">번역</h6>
          <nav aria-label="breadcrumb" class="d-none d-md-inline-block ml-md-4">
            <ol class="breadcrumb breadcrumb-links">
              <li class="breadcrumb-item"><nuxt-link to="/"><i class="fas fa-home mr-2"></i>홈</nuxt-link></li>
              <li class="breadcrumb-item active" aria-current="page">번역</li>
            </ol>
          </nav>
        </div>
        <div class="col-lg-1 col-3 p-0 text-right" v-if="this.$store.state.authUser">
          <base-button outline type="default" v-if="['editor', 'admin'].includes(this.$store.state.authUser.role)" @click="$router.push('/translation/edit')">추가</base-button>
        </div>
        <div class="col-lg-1 col-3 p-0" v-else></div>
        <div class="col-lg-3 col-6 text-lg-right">
          <base-input formGroupClasses="my-0" placeholder="검색..." v-model="keyword" prependIcon="fas fa-search" @keyup="onType"></base-input>
        </div>
      </div>
    </base-header>
    
    <div class="container-fluid mt--6">
      <div class="row"> 
        <div class="col-lg-4 col-12" v-for="article in articleList" :key="articles.title">
          <nuxt-link :to="`/translation/${article._id}`">
            <card>
              <div class="mb-2" v-if="article.tags.length > 0">
                <badge rounded type="primary" v-for="tag in article.tags" :key="tag" class="mr-1">{{ tag }}</badge>
              </div>
              <h3 class="card-title font-weight-700 mb-0">{{ article.title }}</h3>
              <small class="text-muted">{{ article.author }} | {{ dateToString(article.date) }}</small>
              <p class="card-text font-weight-400 mt-2 text-default">{{ stripHtml(article.html) }}</p>
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
        title: '번역',
        meta: [
          { name: 'og:title', content: '번역', hid: 'og:title' },
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
        articles: [],
        articleList: [],
        page: 1,
        keyword: ''
      };
    },
    mounted () {
      this.onLoad()
    },
    computed: {
      filteredList() {
        return this.articles.filter(article => {
          return (article.title.toLowerCase().includes(this.keyword.toLowerCase()) ||
                  article.html.toLowerCase().includes(this.keyword.toLowerCase()) ||
                  article.tags.join().toLowerCase().includes(this.keyword.toLowerCase()))
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
    },
    methods: {
      stripHtml(html) {
        let tmp = document.createElement("DIV")
        tmp.innerHTML = html
        if (tmp.textContent.length > 90) return tmp.textContent.slice(0, 90) + '...' || tmp.innerText.slice(0, 90) + '...' || "내용이 없습니다."
        else return tmp.textContent || tmp.innerText || "내용이 없습니다."
      },
      dateToString(date) {
        date = new Date(date)
        return date.toLocaleDateString('ko-KR', {weekday:'long', year:'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric'})
      },
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
        this.articles = await this.$axios.$get(`/api/translation/list`)
        this.articleList.push(...this.paginatedList)
      },
      async onType() {
        this.articleList.length = 0
        this.page = 1
        this.$refs.InfiniteLoading.stateChanger.reset()
        this.articleList.push(...this.paginatedList)
      }
    }
  };
</script>
<style>
</style>
