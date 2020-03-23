<template>
  <div>
    <base-header class="pb-6" type="">
      <div class="row align-items-center py-4">
        <div class="col-12">
          <h6 class="h2 d-inline-block mb-0">D4DJ 노래방 번호표</h6>
          <nav aria-label="breadcrumb" class="d-none d-md-inline-block ml-md-4">
            <ol class="breadcrumb breadcrumb-links">
              <li class="breadcrumb-item"><nuxt-link to="/"><i class="fas fa-home mr-2"></i>홈</nuxt-link></li>
              <li class="breadcrumb-item"><nuxt-link to="/karaoke">노래방</nuxt-link></li>
              <li class="breadcrumb-item active" aria-current="page">D4DJ 노래방 번호표</li>
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
                <h3 class="mb-0">D4DJ</h3>
              </div>
              <div class="col-lg"></div>
              <div class="col col-lg-auto">
                <base-input v-model="searchQuery"
                            prepend-icon="fas fa-search"
                            placeholder="검색..." alternative
                            formGroupClasses="mb-0">
                </base-input>
              </div>
              <div class="col-auto" v-if="this.$store.state.authUser">
                <base-button type="neutral" v-if="['editor', 'admin'].includes(this.$store.state.authUser.role)" @click="addSongInit">
                  <span class="btn-inner--icon"><i class="fas fa-plus"></i></span>
                  <span class="btn-inner--text">추가</span>
                </base-button>
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
             <el-table-column :key="titleCol.label" :column-key="titleCol.label" v-bind="titleCol">
                <template slot-scope="{row}">
                  {{ row.title }}
                  <small class="d-block mt--1" v-if="row.titleKR">{{ row.titleKR }}</small>
                </template>
              </el-table-column>
              <el-table-column
                v-for="column in tableColumns"
                :key="column.label"
                v-bind="column"
              >
              </el-table-column>
              <template v-if="this.$store.state.authUser">
                <el-table-column align="center" v-if="['editor', 'admin'].includes(this.$store.state.authUser.role)">
                  <div slot-scope="{row}" class="table-actions">
                    <el-tooltip content="수정" placement="top">
                      <div class="d-inline-flex px-1" @click.prevent="onEdit(row)">
                       <i class="fas fa-edit"></i>
                      </div>
                    </el-tooltip>
                    <el-tooltip content="삭제" placement="top">
                      <div class="d-inline-flex px-1" @click.prevent="onDelete(row)">
                        <i class="fas fa-trash"></i>
                      </div>
                    </el-tooltip>
                  </div>
                </el-table-column>
              </template>
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
    
    <modal :show.sync="showModal" modal-classes="modal-secondary">
      <form @submit.prevent="saveSong">
        <base-input label="제목"
                    v-model.lazy="model.title"
                    input-classes="form-control-alternative">
        </base-input>
        <base-input label="제목 (한국어)"
                    v-model.lazy="model.titleKR"
                    input-classes="form-control-alternative">
        </base-input>
        <div class="form-group">
          <base-input label="검색어">
            <tags-input v-model="model.tags"></tags-input>
          </base-input>
        </div>
        <base-input label="가수"
                    v-model.lazy="model.singer"
                    input-classes="form-control-alternative">
        </base-input>
        <base-input label="JOYSOUND"
                    v-model.lazy="model.joysound"
                    input-classes="form-control-alternative">
        </base-input>
        <base-input label="DAM"
                    v-model.lazy="model.dam"
                    input-classes="form-control-alternative">
        </base-input>
        <base-input label="UGA"
                    v-model.lazy="model.uga"
                    input-classes="form-control-alternative">
        </base-input>
      </form>
      <template slot="footer">
        <button type="submit" class="btn btn-primary" @click="saveSong(model._id)">확인</button>
        <button type="button" class="btn btn-link ml-auto" @click="showModal = false">닫기</button>
      </template>
    </modal>
    
  </div>
</template>
<script>
  // Components
  import { Table, TableColumn, Select, Option } from 'element-ui';
  import { BasePagination } from '@/components/argon-core';
  import BaseHeader from '@/components/argon-core/BaseHeader';
  import RouteBreadCrumb from '@/components/argon-core/Breadcrumb/RouteBreadcrumb';
  import TagsInput from '@/components/argon-core/Inputs/TagsInput'
  import swal from 'sweetalert2'
  
  export default {
    head () {
      return {
        title: 'D4DJ 노래방 번호표',
        meta: [
          { name: 'og:title', content: 'D4DJ 노래방 번호표', hid: 'og:title', template: chunk => `${chunk} - 부시로드 성우 정보` },
          { name: 'og:url', content: `https://bushiroad.seiyuus.com${this.$route.fullPath}`, hid: 'og:url' }
        ]
      }
    },
    components: {
      BasePagination,
      BaseHeader,
      RouteBreadCrumb,
      TagsInput,
      [Table.name]: Table,
      [TableColumn.name]: TableColumn,
      [Select.name]: Select,
      [Option.name]: Option
    },
    data() {
      return {
        project: null,
        showModal: false,
        titleCol: {
          prop: 'title',
          label: '제목',
          minWidth: 200,
          sortable: true
        },
        tableColumns: [
          {
            prop: 'singer',
            label: '가수',
            minWidth: 310,
            sortable: true
          },
          {
            prop: 'joysound',
            label: 'JOYSOUND',
            minWidth: 120,
            sortable: false
          },
          {
            prop: 'dam',
            label: 'DAM',
            minWidth: 100,
            sortable: false
          },
          {
            prop: 'uga',
            label: 'UGA',
            minWidth: 100,
            sortable: false
          }
        ],
        tableData: [],
        selectedRows: [],
        searchQuery: '',
        model: {
          title: '',
          titleKR: '',
          project: 'd4dj',
          tags: [],
          singer: '',
          joysound: '',
          dam: '',
          uga: ''
        },
        pagination: {
          perPage: 25,
          currentPage: 1,
          total: 0
        }
      }
    },
    async asyncData({$axios}) {
      let data = await $axios.$get('/api/karaoke/d4dj')
      return {
        tableData: data
      }
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
      saveSong(uid) {
        if (uid === undefined) {
          this.$axios.$post('/api/karaoke', {data: this.model})
            .then(res => {
              this.$notify({type: 'success', message: '요청을 처리완료했습니다', timeout: 3000})
              this.showModal = false
              this.reloadData()
            })
            .catch(err => {
              this.showModal = false
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
        } else {
        this.$axios.$put(`/api/karaoke/${uid}`, {data: this.model})
          .then(res => {
            this.$notify({type: 'success', message: '요청을 처리완료했습니다', timeout: 3000})
            this.showModal = false
            this.reloadData()
          })
          .catch(err => {
            this.showModal = false
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
        }
      },
      onEdit(row) {
        this.model = {...row}
        this.showModal = true
      },
      onDelete(row) {
        swal.fire({
          icon: 'question',
          title: '해당 곡 정보를 삭제하시겠습니까?',
          html: `<strong>제목 : ${row.title}</strong>`,
          showCancelButton: true,
          customClass: {
            confirmButton: 'btn btn-danger btn-fill',
            cancelButton: 'btn btn-default btn-fill'
          },
          confirmButtonText: '삭제',
          cancelButtonText: '취소',
          buttonsStyling: false,
          reverseButtons: true
        })
        .then((result) => {
          if (result.value) {
            this.$axios.$delete('/api/karaoke/' + row._id)
              .then(res => {
                this.reloadData()
                this.$notify({type: 'success', message: '삭제했습니다', timeout: 3000})
              })
              .catch(err => {
                this.showModal = false
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
          }
        })
      },
      addSongInit() {
        this.model = {
          title: '',
          titleKR: '',
          project: 'd4dj',
          tags: [],
          singer: '',
          joysound: '',
          dam: '',
          uga: ''
        }
        this.showModal = true
      },
      reloadData() {
        this.$axios.$get('/api/karaoke/d4dj')
          .then(data => {
            this.tableData = data
          })
          .catch(err => {
            this.$sentry.captureException(err)
          })
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
                  data.titleKR.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                  data.tags.join().toLowerCase().includes(this.searchQuery.toLowerCase()))
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
.el-table .cell, .el-table th div {
  overflow: visible;
}
.el-table .cell {
  word-break: keep-all;
}
</style>
