<template>
  <div>
    <base-header class="pb-6" type="">
      <div class="row align-items-center py-4">
        <div class="col-12">
          <h6 class="h2 d-inline-block mb-0">노래방 번호 검색</h6>
          <nav aria-label="breadcrumb" class="d-none d-md-inline-block ml-md-4">
            <ol class="breadcrumb breadcrumb-links">
              <li class="breadcrumb-item"><nuxt-link to="/"><i class="fas fa-home mr-2"></i>홈</nuxt-link></li>
              <li class="breadcrumb-item"><nuxt-link to="/karaoke">노래방</nuxt-link></li>
              <li class="breadcrumb-item active" aria-current="page">노래방 번호 검색</li>
            </ol>
          </nav>
        </div>
      </div>
    </base-header>
    
    <div class="container-fluid mt--6">
      <div>
        <card class="no-border-card" body-classes="px-0 py-0" footer-classes="pb-2 border-0" header-classes="border-0">
          <template slot="header">
            <div class="row">
              <div class="col-auto pb-3 pb-lg-0 my-auto">
                <h3 class="mb-0">검색결과 - {{$route.params.keyword}}</h3>
              </div>
              <div class="col-lg"></div>
              <div class="col col-lg-auto">
                <base-input v-model="searchQuery"
                            prepend-icon="fas fa-search"
                            placeholder="검색..." alternative
                            formGroupClasses="mb-0">
                </base-input>
              </div>
            </div>
          </template>
          <div>
            <el-table :data="tableDataProcess"
                      height="600"
                      row-key="no"
                      header-row-class-name="thead-light"
                      @sort-change="sortChange"
                      @selection-change="selectionChange">
              <el-table-column
                v-for="column in tableColumns"
                :key="column.label"
                v-bind="column"
              >
              </el-table-column>
            </el-table>
          </div>
          <div
            slot="footer"
            class="col-12 d-flex justify-content-center justify-content-sm-between flex-wrap"
          >
            <div class="">
              <p class="card-category">
                전체 {{ searchQueryProcess.length }}개의 검색결과 중 {{ from + 1 }} ~ {{ to }} 항목 표시 중

                <span v-if="selectedRows.length">
                  &nbsp; &nbsp; {{selectedRows.length}}개의 열이 선택되었습니다
                </span>
              </p>

            </div>
            <base-pagination
              class="pagination-no-border"
              v-model="pagination.currentPage"
              :per-page="pagination.perPage"
              :total="searchQueryProcess.length"
            >
            </base-pagination>
          </div>
        </card>
      </div>
    </div>
  </div>
</template>
<script>
  // Components
  import { Table, TableColumn } from 'element-ui';
  import { BasePagination } from '@/components/argon-core';
  import BaseHeader from '@/components/argon-core/BaseHeader';
  import RouteBreadCrumb from '@/components/argon-core/Breadcrumb/RouteBreadcrumb';
  
  export default {
    head () {
      return {
        title: `${this.$route.params.keyword}`,
        meta: [
          { name: 'og:title', content: `${this.$route.params.keyword}`, hid: 'og:title' },
          { name: 'og:url', content: `https://bushiroad.seiyuus.com${this.$route.fullPath}`, hid: 'og:url' }
        ]
      }
    },
    components: {
      BasePagination,
      BaseHeader,
      RouteBreadCrumb,
      [Table.name]: Table,
      [TableColumn.name]: TableColumn
    },
    data() {
      return {
        tableColumns: [
          {
            prop: 'brand',
            label: '브랜드',
            minWidth: 120,
            sortable: true,
            className: 'text-uppercase'
          },
          {
            prop: 'title',
            label: '제목',
            minWidth: 180,
            sortable: true
          },
          {
            prop: 'singer',
            label: '가수',
            minWidth: 200,
            sortable: true
          },
          {
            prop: 'no',
            label: '번호',
            minWidth: 100,
            sortable: true
          },
          {
            prop: 'release',
            label: '출시일',
            minWidth: 120,
            sortable: true
          }
        ],
        tableData: [],
        selectedRows: [],
        searchQuery: '',
        pagination: {
          perPage: 25,
          currentPage: 1,
          total: 0
        }
      }
    },
    created() {
      let url = 'https://api.manana.kr/v2/karaoke/search.json?limit=500'
      if(this.$route.params.keyword.length < 4) {
        url += '&titleLikeSide=right'
      }
      if(this.$route.params.brand !== 'all') {
        url += `&brand=${this.$route.params.brand}`
      }
      url += `&${this.$route.params.type}=${this.$route.params.keyword}`
      this.$axios.$get(url)
        .then(resData => {
          let data = resData.data
          data.filter(val => {
            if (val.brand === 'kumyoung') return val.brand = 'ky'
          })
          this.tableData = data
        })
        .catch(err => {
          console.log(err)
        })
    },
    methods: {
      selectionChange(selectedRows) {
        this.selectedRows = selectedRows
      },
      sortChange({ prop, order }) {
        if (prop) {
          this.tableData.sort((a, b) => {
            let aVal = a[prop]
            let bVal = b[prop]
            if (order === 'ascending') {
              return aVal > bVal ? 1 : -1
            }
            return bVal - aVal ? 1 : -1
          })
        } else {
          this.tableData.sort((a, b) => {
            return a.id - b.id
          })
        }
      }
    },
    computed: {
      to() {
        let highBound = this.from + this.pagination.perPage;
        if (this.total < highBound) {
          highBound = this.total;
        }
        return highBound;
      },
      from() {
        return this.pagination.perPage * (this.pagination.currentPage - 1);
      },
      total() {
        return this.searchQueryProcess.length
      },
      tableDataProcess() {
        return this.searchQueryProcess.slice(this.from, this.to)
      },
      searchQueryProcess() {
        let result = this.tableData
        result = result.filter(data => {
          return (data.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                  data.singer.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                  data.no.toLowerCase().includes(this.searchQuery.toLowerCase()))
        })
        return result
      }
    }
  }
</script>
<style>
.no-border-card .card-footer{
  border-top: 0;
}
</style>
