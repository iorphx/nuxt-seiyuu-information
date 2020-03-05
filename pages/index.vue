<template>
  <div>
    <base-header class="pb-6" type="">
      <div class="row align-items-center py-4">
        <div class="col-12">
          <h6 class="h2 d-inline-block mb-0">홈</h6>
          <nav aria-label="breadcrumb" class="d-none d-md-inline-block ml-md-4">
            <ol class="breadcrumb breadcrumb-links">
              <li class="breadcrumb-item active" aria-current="page"><i class="fas fa-home mr-2"></i>홈</li>
            </ol>
          </nav>
        </div>
      </div>
    </base-header>
    
    <div class="container-fluid mt--6">
      <div class="row">
        <div class="col-12 col-lg-3">
          <stats-card>
            <!-- Card body -->
            <div class="row">
                <div class="col">
                    <h5 class="card-title text-uppercase text-muted mb-0">환율</h5>
                    <span class="h2 font-weight-bold mb-0">{{ exchangeRate }}</span>
                </div>
                <div class="col-auto">
                    <div class="icon icon-shape bg-gradient-teal text-white rounded-circle shadow">
                        <i class="ni ni-money-coins"></i>
                    </div>
                </div>
            </div>
          </stats-card>
        </div>
        <div class="col-12 col-lg-9">
          <client-only>
            <calendar-widget></calendar-widget>
          </client-only>
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
    data() {
      return {
        exchangeRate: null
      };
    },
    mounted() {
      this.fetchData()
    },
    methods: {
      async fetchData() {
        let data = await this.$axios.$get('https://api.manana.kr/exchange/rate/KRW/JPY.json')
        this.exchangeRate = (data[0].rate * 100).toFixed(2)
      }
    }
  };
</script>
<style>
</style>
