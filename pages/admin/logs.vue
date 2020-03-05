<template>
  <div>
    <base-header class="pb-6" type="">
      <div class="row align-items-center py-4">
        <div class="col-12">
          <h6 class="h2 d-inline-block mb-0">서버 로그</h6>
          <nav aria-label="breadcrumb" class="d-none d-md-inline-block ml-md-4">
            <ol class="breadcrumb breadcrumb-links">
              <li class="breadcrumb-item"><nuxt-link to="/"><i class="fas fa-home mr-2"></i>홈</nuxt-link></li>
              <li class="breadcrumb-item"><nuxt-link to="/admin">관리</nuxt-link></li>
              <li class="breadcrumb-item active" aria-current="page">서버 로그</li>
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
                <h3 class="mb-0">서버 로그</h3>
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
                전체 {{ total }}개의 검색결과 중 {{ from + 1 }} ~ {{ to }} 항목 표시 중

                <span v-if="selectedRows.length">
                  &nbsp; &nbsp; {{selectedRows.length}}개의 열이 선택되었습니다
                </span>
              </p>

            </div>
            <base-pagination
              class="pagination-no-border"
              v-model="pagination.currentPage"
              :per-page="pagination.perPage"
              :total="total"
            >
            </base-pagination>
          </div>
        </card>
      </div>
    </div>
  </div>
</template>
<script>
  import { Table, TableColumn } from 'element-ui';
  import { BasePagination } from '@/components/argon-core';
  import BaseHeader from '@/components/argon-core/BaseHeader';
  import RouteBreadCrumb from '@/components/argon-core/Breadcrumb/RouteBreadcrumb';
  
  export default {
    middleware: 'admin',
    components: {
      BasePagination,
      BaseHeader,
      RouteBreadCrumb,
      [Table.name]: Table,
      [TableColumn.name]: TableColumn
    },
    data() {
      return {
        logs: [],
        tableColumns: [
          {
            prop: 'method',
            label: '요청방식',
            minWidth: 100,
            sortable: true,
            filters: [
              {text: "POST", value: "POST"},
              {text: "DELETE", value: "DELETE"},
              {text: "PATCH", value: "PATCH"},
              {text: "PUT", value: "PUT"}
            ],
            filterMethod: this.filterHandler
          },
          {
            prop: 'statusCode',
            label: '요청코드',
            minWidth: 100,
            sortable: true,
            filters: [
              {text: "200", value: "200"},
              {text: "400", value: "400"},
              {text: "401", value: "401"},
              {text: "403", value: "403"},
              {text: "404", value: "404"},
              {text: "409", value: "409"},
              {text: "500", value: "500"},
              {text: "502", value: "502"},
              {text: "503", value: "503"},
              {text: "504", value: "504"},
            ],
            filterMethod: this.filterHandler
          },
          {
            prop: 'username',
            label: '닉네임',
            minWidth: 80,
            sortable: true
          },
          {
            prop: 'url',
            label: '요청주소',
            minWidth: 110,
            sortable: true
          },
          {
            prop: 'referrer',
            label: '출발주소',
            minWidth: 220,
            sortable: true
          },
          {
            prop: 'userAgent',
            label: '클라이언트 정보',
            minWidth: 190,
            sortable: true
          },
          {
            prop: 'ip',
            label: 'IP 주소',
            minWidth: 110,
            sortable: true
          },
          {
            prop: 'date',
            label: '요청날짜',
            minWidth: 200,
            sortable: true
          }
        ],
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
      this.$axios.$get('/api/admin/logs')
        .then(logs => {
          logs.filter(log => {
            let logArr = log.log.split('|')
            
            let date = new Date(log.date)
            log.date = date.toLocaleDateString('ko-KR', {weekday:'long', year:'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric'})
            
            log.log = undefined
            
            log.username = logArr[0]
            log.method = logArr[1]
            log.url = logArr[2]
            log.statusCode = logArr[3]
            log.referrer = logArr[4]
            log.userAgent = logArr[5]
            log.ip = logArr[6].split(', ')[0]
            
            return log
          })
          this.logs = logs
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
      },
      filterHandler(value, row, column) {
        const property = column['property'];
        return row[property] === value
      },
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
        let result = this.logs
        result = result.filter(data => {
          return (data.username.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                  data.url.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                  data.referrer.toLowerCase().includes(this.searchQuery.toLowerCase()))
        })
        return result
      }
    }
  };
</script>
<style>
</style>
